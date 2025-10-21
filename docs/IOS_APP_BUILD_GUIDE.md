# 📱 MAIA iOS App Build Guide

## 🎉 Capacitor is Installed!

Your MAIA app is now ready to be built as a native iOS app! Here's everything you need to know.

## ✅ What's Already Set Up

1. **Capacitor Core** - Installed and configured
2. **iOS Platform** - Native Xcode project created in `/ios` folder
3. **HealthKit Plugin** - Ready for live biometric streaming
4. **Next.js Integration** - Your web app wraps perfectly

## 🚀 How to Build & Run

### Step 1: Build Your Next.js App

```bash
npm run build
npx cap copy ios
```

This exports your Next.js app and copies it to the iOS project.

### Step 2: Open in Xcode

```bash
npx cap open ios
```

This opens the iOS project in Xcode.

### Step 3: Configure HealthKit Permissions

In Xcode, you need to add HealthKit permissions:

1. Open `ios/App/App/Info.plist`
2. Add these keys:

```xml
<key>NSHealthShareUsageDescription</key>
<string>MAIA needs access to your heart rate and HRV data to provide real-time coherence feedback during sessions.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>MAIA may store session data to Health app for your records.</string>
```

### Step 4: Enable HealthKit Capability

1. In Xcode, select your project
2. Go to **Signing & Capabilities** tab
3. Click **+ Capability**
4. Add **HealthKit**

### Step 5: Run on Device or Simulator

1. Select your iPhone or Simulator
2. Click **Run** (⌘R)
3. MAIA will launch as a native app!

## 💗 Live HealthKit Integration

Once the app is running, you can access HealthKit data in real-time:

```typescript
import { HealthKit } from 'capacitor-healthkit';

// Request permissions
await HealthKit.requestAuthorization({
  read: ['HKQuantityTypeIdentifierHeartRateVariabilitySDNN', 'HKQuantityTypeIdentifierHeartRate'],
  write: []
});

// Get real-time HRV
const hrv = await HealthKit.queryHKitSampleType({
  sampleType: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  limit: 1
});
```

## 🔄 Development Workflow

**The magic of Capacitor:**

### For UI/Logic Changes (Most Changes):
```bash
# 1. Make changes to your Next.js code
# 2. Deploy to Vercel/your server
# 3. App automatically pulls new version!
```

No rebuild needed! The app loads from your web server.

### For Native Changes Only:
```bash
npm run build
npx cap copy ios
npx cap open ios
# Then rebuild in Xcode
```

Only needed when changing:
- Native plugins
- HealthKit permissions
- App icons/splash screens
- iOS capabilities

## 📦 What Got Created

### New Files:
- `capacitor.config.ts` - Capacitor configuration
- `/ios/` folder - Complete Xcode project

### Your Next.js App:
- **No changes needed!** It works as-is
- Keeps deploying to web normally
- Same codebase powers both PWA and native app

## 🎯 Next Steps

### 1. Test on Your iPhone

```bash
npm run build
npx cap copy ios
npx cap open ios
```

Then in Xcode:
- Select your iPhone
- Click Run
- MAIA launches natively!

### 2. Add Live HealthKit Streaming

Create `/lib/biometrics/HealthKitBridge.ts`:

```typescript
import { HealthKit } from 'capacitor-healthkit';
import { realtimeBiometricService } from './RealtimeBiometricService';

export class HealthKitBridge {
  async startLiveStreaming() {
    // Request permissions
    await HealthKit.requestAuthorization({
      read: ['HKQuantityTypeIdentifierHeartRateVariabilitySDNN'],
      write: []
    });

    // Poll every 5 seconds for new data
    setInterval(async () => {
      const hrv = await HealthKit.queryHKitSampleType({
        sampleType: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
        limit: 1
      });

      if (hrv.resultData[0]) {
        realtimeBiometricService.injectUpdate({
          hrv: hrv.resultData[0].quantity
        });
      }
    }, 5000);
  }
}
```

### 3. Submit to TestFlight

When ready for beta testing:

1. **Archive** in Xcode (Product → Archive)
2. **Distribute** → App Store Connect
3. Upload to TestFlight
4. Invite beta testers!

## 🌟 Hybrid Deploy Strategy

Your perfect deployment setup:

```
┌─────────────────────────────────────┐
│   MAIA Next.js App (Vercel)         │
│   - Instant updates                 │
│   - Same code for web & app         │
└─────────────────────────────────────┘
         │                │
         ▼                ▼
   ┌─────────┐      ┌──────────┐
   │   PWA   │      │ iOS App  │
   │         │      │          │
   │  Web    │      │ Native   │
   │ Version │      │HealthKit │
   └─────────┘      └──────────┘
```

**Users choose:**
- **PWA** - Install from web, works everywhere, no app store
- **iOS App** - Download from App Store, get live HealthKit

**You maintain:**
- One codebase
- Deploy once
- Both update automatically!

## 📱 App Features vs PWA Features

| Feature | PWA | Native App |
|---------|-----|------------|
| Voice conversation | ✅ | ✅ |
| Holoflower visualization | ✅ | ✅ |
| Manual health upload | ✅ | ✅ |
| Live HealthKit streaming | ❌ | ✅ |
| Background monitoring | ❌ | ✅ |
| App Store distribution | ❌ | ✅ |
| Instant updates | ✅ | ✅ |
| No installation needed | ✅ | ❌ |

## 🔧 Troubleshooting

### "Build failed in Xcode"
- Make sure you have latest Xcode (15+)
- Check that iOS deployment target is 13.0+
- Run `pod install` in `/ios/App` folder

### "HealthKit not working"
- Check Info.plist has the permission strings
- Verify HealthKit capability is enabled
- Test on real device (simulator has limited HealthKit)

### "App won't update"
- The app loads from your web server
- Make sure you deployed your changes
- Try: Settings → Clear Cache in the app

## 🎨 Customization

### App Icon
Place your icon in: `/ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Splash Screen
Edit: `/ios/App/App/Assets.xcassets/Splash.imageset/`

### App Name
Change in: `/ios/App/App/Info.plist` → `CFBundleDisplayName`

## 🚀 Production Checklist

Before submitting to App Store:

- [ ] Test on real iPhone
- [ ] Verify HealthKit permissions work
- [ ] Add App Privacy Policy
- [ ] Set version number in Xcode
- [ ] Create app screenshots
- [ ] Write App Store description
- [ ] Test with TestFlight beta users
- [ ] Submit for App Review

## 💡 Tips

1. **Iterate on web first** - Much faster than rebuilding iOS
2. **Use TestFlight early** - Get feedback from real users
3. **Keep PWA working** - Not everyone wants to download an app
4. **Hot reload during development** - Run dev server, point Capacitor config to localhost

## 🆘 Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- HealthKit Plugin: https://github.com/Ad-Scientiam/capacitor-healthkit
- Xcode Help: https://developer.apple.com/xcode/

---

## ✨ You're Ready!

Your MAIA app can now:
- Deploy as both PWA and native app
- Access HealthKit in real-time
- Provide live coherence feedback
- Reach users on web and App Store

**Next command to run:**
```bash
npm run build && npx cap copy ios && npx cap open ios
```

Then hit Run in Xcode and see MAIA come alive on your iPhone! 📱💗✨
