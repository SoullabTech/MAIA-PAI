/**
 * Server-Sent Events endpoint for real-time timing diagnostics
 */
import { NextRequest } from 'next/server';

// Store for active connections
const connections = new Set<ReadableStreamDefaultController>();

// Store for recent metrics (in-memory buffer)
const recentMetrics: any[] = [];
const MAX_METRICS = 100;

// Export POST to receive metrics from the timing service
export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Add to recent metrics buffer
    recentMetrics.unshift(metric);
    if (recentMetrics.length > MAX_METRICS) {
      recentMetrics.pop();
    }

    // Broadcast to all connected clients
    const message = `data: ${JSON.stringify(metric)}\n\n`;
    connections.forEach(controller => {
      try {
        controller.enqueue(new TextEncoder().encode(message));
      } catch (error) {
        // Remove dead connections
        connections.delete(controller);
      }
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error processing timing metric:', error);
    return Response.json({ error: 'Failed to process metric' }, { status: 500 });
  }
}

// Export GET for SSE stream
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Add to connections
      connections.add(controller);

      // Send initial data (recent metrics)
      const initialData = `data: ${JSON.stringify({
        type: 'initial',
        metrics: recentMetrics.slice(0, 20)
      })}\n\n`;
      controller.enqueue(encoder.encode(initialData));

      // Send heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(':heartbeat\n\n'));
        } catch (error) {
          clearInterval(heartbeat);
          connections.delete(controller);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        connections.delete(controller);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}