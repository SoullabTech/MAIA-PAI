// Minimal stub for voice lock service
class VoiceLockService {
  private isLocked = false;
  private lockReason: string | null = null;

  acquire(reason: string): void {
    console.log(`[VoiceLock] acquire: ${reason}`);
    this.isLocked = true;
    this.lockReason = reason;
  }

  release(): void {
    console.log(`[VoiceLock] release: ${this.lockReason || 'unknown'}`);
    this.isLocked = false;
    this.lockReason = null;
  }

  isActive(): boolean {
    return this.isLocked;
  }

  getReason(): string | null {
    return this.lockReason;
  }
}

export const voiceLock = new VoiceLockService();