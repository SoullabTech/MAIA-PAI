/**
 * GANESHA CALENDAR TOOL
 *
 * ARM 3: Task Initiation - Removes obstacles through ACTUAL SCHEDULING
 *
 * The elephant doesn't just remember—the elephant schedules.
 * The four arms don't just hold—the four arms execute.
 *
 * This tool integrates with Google Calendar to automatically:
 * - Schedule micro-steps from task breakdowns
 * - Create focus time blocks
 * - Set up recurring reminders
 * - Remove friction by doing the scheduling FOR the user
 */

import { google } from 'googleapis';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
}

export interface MicroStepSchedule {
  task: string;
  steps: string[];
  startTime: Date;
  minutesPerStep: number;
  bufferMinutes: number;
}

// ============================================================================
// GOOGLE CALENDAR CLIENT
// ============================================================================

class GoogleCalendarClient {
  private calendar;
  private isConfigured: boolean = false;

  constructor() {
    // Check if OAuth credentials are configured
    const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn('[CALENDAR TOOL] Google Calendar not configured. Running in SIMULATION mode.');
      this.isConfigured = false;
      this.calendar = null;
      return;
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    this.isConfigured = true;

    console.log('[CALENDAR TOOL] ✅ Google Calendar configured');
  }

  /**
   * Create a single calendar event
   */
  async createEvent(userId: string, event: CalendarEvent): Promise<string> {
    if (!this.isConfigured || !this.calendar) {
      // SIMULATION MODE - Log what would happen
      const simulatedEventId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log('[CALENDAR TOOL] 📅 SIMULATED EVENT CREATION:');
      console.log(`  Title: ${event.title}`);
      console.log(`  Start: ${event.start.toISOString()}`);
      console.log(`  End: ${event.end.toISOString()}`);
      console.log(`  Description: ${event.description || 'N/A'}`);
      console.log(`  Simulated Event ID: ${simulatedEventId}`);

      return simulatedEventId;
    }

    // REAL MODE - Actually create the event
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: event.title,
          description: event.description,
          location: event.location,
          start: {
            dateTime: event.start.toISOString(),
            timeZone: 'America/Los_Angeles', // TODO: Get from user profile
          },
          end: {
            dateTime: event.end.toISOString(),
            timeZone: 'America/Los_Angeles',
          },
          reminders: event.reminders || {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 10 },
            ],
          },
        },
      });

      const eventId = response.data.id!;
      console.log(`[CALENDAR TOOL] ✅ Created event: ${event.title} (${eventId})`);
      return eventId;

    } catch (error) {
      console.error('[CALENDAR TOOL] Error creating event:', error);
      throw error;
    }
  }

  /**
   * Schedule micro-steps as individual calendar events
   */
  async scheduleMicroSteps(userId: string, schedule: MicroStepSchedule): Promise<string[]> {
    const eventIds: string[] = [];
    let currentTime = new Date(schedule.startTime);

    for (let i = 0; i < schedule.steps.length; i++) {
      const step = schedule.steps[i];
      const stepNumber = i + 1;

      // Calculate end time
      const endTime = new Date(currentTime.getTime() + schedule.minutesPerStep * 60000);

      // Create event for this micro-step
      const event: CalendarEvent = {
        title: `🐘 Step ${stepNumber}/${schedule.steps.length}: ${step}`,
        description: `GANESHA Micro-Step for: ${schedule.task}\n\nThis is step ${stepNumber} of ${schedule.steps.length}. Just do this one tiny thing. That's the whole game.\n\n🎯 Focus: ${step}\n\n✨ Celebrate when done - every micro-win is sacred!`,
        start: currentTime,
        end: endTime,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 5 }, // 5 min before
            { method: 'popup', minutes: 0 },  // At start time
          ],
        },
      };

      const eventId = await this.createEvent(userId, event);
      eventIds.push(eventId);

      // Move to next time slot (current end + buffer)
      currentTime = new Date(endTime.getTime() + schedule.bufferMinutes * 60000);
    }

    console.log(`[CALENDAR TOOL] ✅ Scheduled ${eventIds.length} micro-steps for: ${schedule.task}`);
    return eventIds;
  }

  /**
   * Create a focus time block
   */
  async createFocusBlock(
    userId: string,
    title: string,
    startTime: Date,
    durationMinutes: number
  ): Promise<string> {
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const event: CalendarEvent = {
      title: `🧠 Focus Time: ${title}`,
      description: `GANESHA Focus Block\n\nProtected time for deep work. Your hyperfocus is sacred.\n\nRemember:\n- Water nearby\n- Snack ready\n- Timer set\n- Body check every 90 min\n\n🐘 The elephant protects your flow.`,
      start: startTime,
      end: endTime,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
          { method: 'popup', minutes: Math.floor(durationMinutes / 2) }, // Halfway check-in
        ],
      },
    };

    return await this.createEvent(userId, event);
  }

  /**
   * Create recurring reminder
   */
  async createRecurringReminder(
    userId: string,
    title: string,
    startTime: Date,
    frequency: 'daily' | 'weekly' | 'custom',
    customRecurrence?: string
  ): Promise<string> {
    if (!this.isConfigured || !this.calendar) {
      const simulatedEventId = `sim_recurring_${Date.now()}`;
      console.log(`[CALENDAR TOOL] 📅 SIMULATED RECURRING EVENT: ${title} (${frequency})`);
      return simulatedEventId;
    }

    try {
      const recurrenceRule = frequency === 'daily'
        ? 'RRULE:FREQ=DAILY'
        : frequency === 'weekly'
        ? 'RRULE:FREQ=WEEKLY'
        : customRecurrence || 'RRULE:FREQ=DAILY';

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: `🐘 ${title}`,
          description: 'GANESHA recurring reminder - Divine Harmonics support',
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: new Date(startTime.getTime() + 15 * 60000).toISOString(), // 15 min duration
            timeZone: 'America/Los_Angeles',
          },
          recurrence: [recurrenceRule],
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 0 }],
          },
        },
      });

      const eventId = response.data.id!;
      console.log(`[CALENDAR TOOL] ✅ Created recurring reminder: ${title}`);
      return eventId;

    } catch (error) {
      console.error('[CALENDAR TOOL] Error creating recurring reminder:', error);
      throw error;
    }
  }
}

// Singleton instance
let calendarClient: GoogleCalendarClient | null = null;

function getCalendarClient(): GoogleCalendarClient {
  if (!calendarClient) {
    calendarClient = new GoogleCalendarClient();
  }
  return calendarClient;
}

// ============================================================================
// LANGCHAIN TOOLS
// ============================================================================

/**
 * Schedule Event Tool
 */
export const createScheduleEventTool = () => new DynamicStructuredTool({
  name: 'schedule_event',
  description: `
    Schedule a calendar event for the user.
    Use when user asks to schedule something or when breaking down tasks into scheduled steps.
    The elephant doesn't just remember—the elephant SCHEDULES.
  `,
  schema: z.object({
    userId: z.string().describe('User ID'),
    title: z.string().describe('Event title'),
    startTime: z.string().describe('Start time in ISO format (e.g., "2025-11-08T14:00:00")'),
    durationMinutes: z.number().describe('Duration in minutes'),
    description: z.string().optional().describe('Event description'),
  }),
  func: async ({ userId, title, startTime, durationMinutes, description }) => {
    const client = getCalendarClient();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const eventId = await client.createEvent(userId, {
      title,
      start,
      end,
      description,
    });

    return `✅ Scheduled: "${title}" at ${start.toLocaleString()} for ${durationMinutes} min\nEvent ID: ${eventId}`;
  },
});

/**
 * Schedule Micro-Steps Tool
 */
export const createScheduleMicroStepsTool = () => new DynamicStructuredTool({
  name: 'schedule_micro_steps',
  description: `
    Automatically schedule micro-steps from a task breakdown into the user's calendar.
    Use when you've broken down a task and want to ACTUALLY schedule the steps for them.
    This is GANESHA removing obstacles through automation.
  `,
  schema: z.object({
    userId: z.string().describe('User ID'),
    task: z.string().describe('The original task being broken down'),
    steps: z.array(z.string()).describe('Array of micro-steps to schedule'),
    startTime: z.string().describe('When to start the first step (ISO format)'),
    minutesPerStep: z.number().default(15).describe('Minutes allocated per step (default 15)'),
    bufferMinutes: z.number().default(5).describe('Buffer between steps (default 5)'),
  }),
  func: async ({ userId, task, steps, startTime, minutesPerStep, bufferMinutes }) => {
    const client = getCalendarClient();

    const schedule: MicroStepSchedule = {
      task,
      steps,
      startTime: new Date(startTime),
      minutesPerStep: minutesPerStep || 15,
      bufferMinutes: bufferMinutes || 5,
    };

    const eventIds = await client.scheduleMicroSteps(userId, schedule);

    const totalTime = steps.length * (minutesPerStep + bufferMinutes);
    const endTime = new Date(new Date(startTime).getTime() + totalTime * 60000);

    return `✅ Obstacle removed! I've scheduled all ${steps.length} micro-steps:\n\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n📅 Start: ${new Date(startTime).toLocaleString()}\n📅 Complete by: ${endTime.toLocaleString()}\n⏱️  Total time: ${totalTime} minutes\n\nYou just need to show up. The calendar will remind you. 🐘`;
  },
});

/**
 * Create Focus Block Tool
 */
export const createFocusBlockTool = () => new DynamicStructuredTool({
  name: 'create_focus_block',
  description: `
    Block off protected time for deep work/hyperfocus.
    Use when user wants uninterrupted focus time or when channeling hyperfocus productively.
  `,
  schema: z.object({
    userId: z.string().describe('User ID'),
    title: z.string().describe('What they\'ll focus on'),
    startTime: z.string().describe('Start time (ISO format)'),
    durationMinutes: z.number().describe('Duration in minutes'),
  }),
  func: async ({ userId, title, startTime, durationMinutes }) => {
    const client = getCalendarClient();
    const start = new Date(startTime);

    const eventId = await client.createFocusBlock(userId, title, start, durationMinutes);

    return `✅ Focus block created: ${durationMinutes} minutes for "${title}"\n🧠 Your hyperfocus is protected.\n🐘 I'll check in halfway to remind you about water/body.\nEvent ID: ${eventId}`;
  },
});

/**
 * Create Recurring Reminder Tool
 */
export const createRecurringReminderTool = () => new DynamicStructuredTool({
  name: 'create_recurring_reminder',
  description: `
    Set up a recurring reminder for habits, check-ins, or regular tasks.
    Use for things that need to happen regularly (daily meds, weekly planning, etc).
  `,
  schema: z.object({
    userId: z.string().describe('User ID'),
    title: z.string().describe('What to be reminded of'),
    startTime: z.string().describe('First occurrence time (ISO format)'),
    frequency: z.enum(['daily', 'weekly']).describe('How often'),
  }),
  func: async ({ userId, title, startTime, frequency }) => {
    const client = getCalendarClient();
    const start = new Date(startTime);

    const eventId = await client.createRecurringReminder(userId, title, start, frequency);

    return `✅ Recurring reminder set: "${title}" every ${frequency}\n🔔 First reminder: ${start.toLocaleString()}\n🐘 The elephant never forgets.\nEvent ID: ${eventId}`;
  },
});

// ============================================================================
// EXPORT
// ============================================================================

export {
  getCalendarClient,
  GoogleCalendarClient,
};
