/**
 * Production Alerts System
 * Sends SMS alerts when critical errors occur
 *
 * Uses Twilio for SMS (can also use email as fallback)
 */

interface AlertConfig {
  telegramBotToken?: string;
  telegramChatId?: string;
  email?: string;
  enabled: boolean;
}

interface CriticalError {
  type: 'maia_fallback' | 'api_error' | 'consciousness_failure' | 'database_error';
  message: string;
  userId?: string;
  timestamp: Date;
  context?: any;
}

class ProductionAlertSystem {
  private config: AlertConfig;
  private recentAlerts: Map<string, Date> = new Map();
  private alertCooldown = 5 * 60 * 1000; // 5 minutes between duplicate alerts

  constructor() {
    this.config = {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
      telegramChatId: process.env.TELEGRAM_CHAT_ID,
      email: process.env.ALERT_EMAIL,
      enabled: process.env.NODE_ENV === 'production' && process.env.ALERTS_ENABLED === 'true'
    };
  }

  /**
   * Send critical alert via SMS and/or email
   */
  async sendAlert(error: CriticalError): Promise<void> {
    if (!this.config.enabled) {
      console.log('📱 Alert (disabled in dev):', error.type, error.message);
      return;
    }

    // Prevent alert spam - only send if not sent recently
    const alertKey = `${error.type}_${error.message}`;
    const lastAlert = this.recentAlerts.get(alertKey);

    if (lastAlert && (Date.now() - lastAlert.getTime() < this.alertCooldown)) {
      console.log('⏭️ Skipping duplicate alert:', error.type);
      return;
    }

    this.recentAlerts.set(alertKey, new Date());

    // Format alert message
    const alertMessage = this.formatAlertMessage(error);

    // Send via multiple channels
    const promises = [];

    if (this.config.telegramBotToken && this.config.telegramChatId) {
      promises.push(this.sendTelegram(this.config.telegramBotToken, this.config.telegramChatId, alertMessage));
    }

    if (this.config.email) {
      promises.push(this.sendEmail(this.config.email, alertMessage, error));
    }

    // Also log to Vercel for debugging
    promises.push(this.logToVercel(error));

    await Promise.allSettled(promises);
  }

  /**
   * Format alert message for SMS (short and actionable)
   */
  private formatAlertMessage(error: CriticalError): string {
    const emoji = this.getErrorEmoji(error.type);

    return `${emoji} MAIA Alert: ${error.type}
${error.message}
Time: ${error.timestamp.toLocaleTimeString()}
Check: https://vercel.com/your-project/logs`;
  }

  /**
   * Send Telegram message
   */
  private async sendTelegram(botToken: string, chatId: string, message: string): Promise<void> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        console.log('📱 Telegram alert sent successfully');
      } else {
        console.error('❌ Failed to send Telegram alert:', await response.text());
      }
    } catch (error) {
      console.error('❌ Telegram alert failed:', error);
    }
  }

  /**
   * Send email via Resend (you already have this configured)
   */
  private async sendEmail(to: string, message: string, error: CriticalError): Promise<void> {
    try {
      if (process.env.RESEND_API_KEY) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'MAIA Alerts <alerts@soullab.life>',
            to: to,
            subject: `🚨 MAIA Production Alert: ${error.type}`,
            html: `
              <h2>MAIA Production Alert</h2>
              <p><strong>Type:</strong> ${error.type}</p>
              <p><strong>Message:</strong> ${error.message}</p>
              <p><strong>Time:</strong> ${error.timestamp.toISOString()}</p>
              ${error.userId ? `<p><strong>User:</strong> ${error.userId}</p>` : ''}
              <hr>
              <p><a href="https://vercel.com/your-project/logs">View Logs</a></p>
              <pre>${JSON.stringify(error.context, null, 2)}</pre>
            `
          })
        });

        if (response.ok) {
          console.log('📧 Email alert sent successfully');
        } else {
          console.error('❌ Failed to send email:', await response.text());
        }
      }
    } catch (error) {
      console.error('❌ Email alert failed:', error);
    }
  }

  /**
   * Log to Vercel for debugging
   */
  private async logToVercel(error: CriticalError): Promise<void> {
    console.error('🚨 CRITICAL ERROR:', {
      type: error.type,
      message: error.message,
      userId: error.userId,
      timestamp: error.timestamp,
      context: error.context
    });
  }

  /**
   * Get emoji for error type
   */
  private getErrorEmoji(type: CriticalError['type']): string {
    const emojis = {
      maia_fallback: '🤖',
      api_error: '⚠️',
      consciousness_failure: '🧠',
      database_error: '💾'
    };
    return emojis[type] || '🚨';
  }
}

// Singleton instance
export const productionAlerts = new ProductionAlertSystem();

// Helper functions for common alert scenarios
export async function alertMAIAFallback(userId: string, reason: string) {
  await productionAlerts.sendAlert({
    type: 'maia_fallback',
    message: `MAIA using fallback response: ${reason}`,
    userId,
    timestamp: new Date()
  });
}

export async function alertAPIError(endpoint: string, error: Error) {
  await productionAlerts.sendAlert({
    type: 'api_error',
    message: `API error at ${endpoint}: ${error.message}`,
    timestamp: new Date(),
    context: { stack: error.stack }
  });
}

export async function alertConsciousnessFailure(reason: string, userId?: string) {
  await productionAlerts.sendAlert({
    type: 'consciousness_failure',
    message: `Consciousness engine failed: ${reason}`,
    userId,
    timestamp: new Date()
  });
}

export async function alertDatabaseError(operation: string, error: Error) {
  await productionAlerts.sendAlert({
    type: 'database_error',
    message: `Database error during ${operation}: ${error.message}`,
    timestamp: new Date(),
    context: { stack: error.stack }
  });
}
