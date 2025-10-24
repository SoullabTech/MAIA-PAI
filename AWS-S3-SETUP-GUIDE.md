# AWS S3 Setup Guide for Soullab Publishing

## Overview
Set up AWS S3 buckets to store manuscripts, published ebooks, audiobooks, cover images, and print-ready files.

**Time Required:** 30-45 minutes
**Cost:** ~$5-20/month (depends on storage and bandwidth)

---

## Prerequisites

1. AWS Account (create at https://aws.amazon.com if you don't have one)
2. Credit card for billing
3. Access to AWS Console

---

## Step 1: Create AWS Account (Skip if you have one)

1. Go to: https://aws.amazon.com
2. Click "Create an AWS Account"
3. Follow signup process
4. Verify email and phone
5. Add payment method

**Note:** AWS Free Tier includes 5GB S3 storage for 12 months.

---

## Step 2: Create S3 Buckets

We'll create 4 buckets for different content types:

### Bucket 1: Manuscripts (Private)

**Purpose:** Store original manuscripts and source files

1. Go to S3 Console: https://console.aws.amazon.com/s3
2. Click "Create bucket"
3. Settings:
   - **Bucket name:** `soullab-manuscripts-[random-suffix]`
     - Example: `soullab-manuscripts-prod-2025`
     - Must be globally unique
   - **Region:** Choose closest to you (e.g., us-west-2 for California)
   - **Block Public Access:** ✅ Check ALL boxes (keep private)
   - **Versioning:** Enable (to track manuscript versions)
   - **Encryption:** Enable (SSE-S3)
   - **Tags:**
     - Key: `Project`, Value: `SoullabPublishing`
     - Key: `Purpose`, Value: `Manuscripts`
4. Click "Create bucket"

### Bucket 2: Published Content (Restricted)

**Purpose:** Store final ebooks, audiobooks, PDFs for customer download

1. Create bucket: `soullab-published-content-[suffix]`
2. Settings:
   - **Region:** Same as manuscripts bucket
   - **Block Public Access:** ✅ Check ALL (we'll use signed URLs)
   - **Versioning:** Enable
   - **Encryption:** Enable (SSE-S3)
   - **Object Lock:** Optional (prevents accidental deletion)
   - **Tags:**
     - Key: `Project`, Value: `SoullabPublishing`
     - Key: `Purpose`, Value: `PublishedContent`

### Bucket 3: Public Assets (Public via CDN)

**Purpose:** Cover images, preview PDFs, sample audio

1. Create bucket: `soullab-public-assets-[suffix]`
2. Settings:
   - **Region:** Same as others
   - **Block Public Access:** ⚠️ Uncheck "Block all public access"
     - Check the box to acknowledge public access
   - **Versioning:** Enable
   - **Encryption:** Enable
   - **Tags:**
     - Key: `Project`, Value: `SoullabPublishing`
     - Key: `Purpose`, Value: `PublicAssets`

3. After creation, set bucket policy for public read access:
   - Click bucket → Permissions → Bucket Policy
   - Paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::soullab-public-assets-[your-suffix]/*"
       }
     ]
   }
   ```
   - Replace `[your-suffix]` with your actual bucket name
   - Save changes

### Bucket 4: Print-Ready Files (Private)

**Purpose:** High-resolution PDFs for print-on-demand

1. Create bucket: `soullab-print-ready-[suffix]`
2. Settings:
   - **Region:** Same as others
   - **Block Public Access:** ✅ Check ALL
   - **Versioning:** Enable
   - **Encryption:** Enable
   - **Tags:**
     - Key: `Project`, Value: `SoullabPublishing`
     - Key: `Purpose`, Value: `PrintReady`

---

## Step 3: Create IAM User for API Access

### Create User

1. Go to IAM Console: https://console.aws.amazon.com/iam
2. Click "Users" → "Create user"
3. **User name:** `soullab-publishing-api`
4. **Access type:** ✅ Programmatic access (Access key ID & Secret)
5. Click "Next"

### Attach Permissions

1. Click "Attach policies directly"
2. Create custom policy:
   - Click "Create policy"
   - Switch to JSON tab
   - Paste:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::soullab-manuscripts-*/*",
           "arn:aws:s3:::soullab-published-content-*/*",
           "arn:aws:s3:::soullab-public-assets-*/*",
           "arn:aws:s3:::soullab-print-ready-*/*",
           "arn:aws:s3:::soullab-manuscripts-*",
           "arn:aws:s3:::soullab-published-content-*",
           "arn:aws:s3:::soullab-public-assets-*",
           "arn:aws:s3:::soullab-print-ready-*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListAllMyBuckets"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
   - Name it: `SoullabPublishingS3Access`
   - Create policy

3. Go back to user creation
4. Refresh policies and select `SoullabPublishingS3Access`
5. Click "Next" → "Create user"

### Save Credentials

**IMPORTANT:** Download and save these credentials securely!

1. Copy **Access key ID** (starts with `AKIA...`)
2. Copy **Secret access key** (long random string)
3. Store in password manager or secure note

⚠️ **You can only see the secret key once!**

---

## Step 4: Add Credentials to .env.local

Add these environment variables to your `.env.local` file:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...your-access-key...
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-west-2  # or your chosen region
AWS_S3_BUCKET_MANUSCRIPTS=soullab-manuscripts-prod-2025
AWS_S3_BUCKET_PUBLISHED=soullab-published-content-prod-2025
AWS_S3_BUCKET_PUBLIC=soullab-public-assets-prod-2025
AWS_S3_BUCKET_PRINT=soullab-print-ready-prod-2025
```

Replace bucket names with your actual bucket names.

---

## Step 5: Test S3 Access

Create a test script to verify S3 access:

```bash
# Save this as test-s3.js
const { S3Client, PutObjectCommand, ListBucketsCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3() {
  try {
    // Test 1: List buckets
    console.log('Testing S3 access...\n');

    const { Buckets } = await s3Client.send(new ListBucketsCommand({}));
    console.log('✓ Connected to S3');
    console.log('✓ Found buckets:', Buckets.map(b => b.Name).join(', '));

    // Test 2: Upload a test file
    const testContent = 'Hello from Soullab Publishing!';
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_MANUSCRIPTS,
      Key: 'test/test-file.txt',
      Body: testContent,
      ContentType: 'text/plain',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('\n✓ Successfully uploaded test file to manuscripts bucket');

    console.log('\n✅ All S3 tests passed! Your buckets are ready.');
  } catch (error) {
    console.error('❌ S3 Test Failed:', error.message);
  }
}

testS3();
```

Run the test:
```bash
npm install @aws-sdk/client-s3
node test-s3.js
```

Expected output:
```
Testing S3 access...

✓ Connected to S3
✓ Found buckets: soullab-manuscripts-prod-2025, soullab-published-content-prod-2025, ...

✓ Successfully uploaded test file to manuscripts bucket

✅ All S3 tests passed! Your buckets are ready.
```

---

## Step 6: Set Up CloudFront CDN (Optional but Recommended)

CloudFront accelerates delivery of public assets (cover images, previews) globally.

### Create CloudFront Distribution

1. Go to CloudFront Console: https://console.aws.amazon.com/cloudfront
2. Click "Create distribution"
3. Settings:
   - **Origin domain:** Select your `soullab-public-assets-*` bucket
   - **Origin path:** Leave empty
   - **Name:** soullab-public-assets
   - **Origin access:** Public (bucket policy allows public access)
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Allowed HTTP methods:** GET, HEAD
   - **Cache policy:** CachingOptimized
   - **Price class:** Use only North America and Europe (or All edge locations for global)
   - **Alternate domain name (CNAME):** Optional - `cdn.soullab.life`
   - **SSL Certificate:** Default CloudFront certificate (or custom if using CNAME)

4. Click "Create distribution"

5. Wait 10-15 minutes for deployment (Status: "Deployed")

6. Test CloudFront URL:
   - Copy distribution domain: `d123456abcdef.cloudfront.net`
   - Upload test image to public bucket
   - Access via CloudFront: `https://d123456abcdef.cloudfront.net/test-image.jpg`

### Update Environment Variables

```bash
# Add CloudFront domain to .env.local
AWS_CLOUDFRONT_DOMAIN=d123456abcdef.cloudfront.net
```

---

## Step 7: Folder Structure in Buckets

Organize files consistently:

### soullab-manuscripts/
```
creator_id/
  work_id/
    v1.0/
      manuscript.docx
      manuscript.md
    v1.1/
      manuscript-revised.docx
```

### soullab-published-content/
```
creator_id/
  work_id/
    ebook/
      elemental-alchemy.epub
      elemental-alchemy.mobi
      elemental-alchemy.pdf
    audiobook/
      elemental-alchemy-full.mp3
      chapter-01.mp3
      chapter-02.mp3
```

### soullab-public-assets/
```
covers/
  work_id/
    cover-1200x1800.jpg
    cover-600x900.jpg
    cover-thumbnail.jpg
previews/
  work_id/
    preview-chapter-1.pdf
```

### soullab-print-ready/
```
creator_id/
  work_id/
    paperback/
      interior.pdf
      cover.pdf
    hardcover/
      interior.pdf
      cover.pdf
```

---

## Step 8: Set Up Lifecycle Policies (Optional Cost Optimization)

Automatically move old files to cheaper storage:

1. Go to S3 bucket → Management → Lifecycle rules
2. Create rule: "Archive old manuscripts"
3. Settings:
   - **Apply to:** Prefix: `*/v*` (all versions)
   - **Transition:** After 90 days → S3 Glacier (cheap archival storage)
   - **Expiration:** Never (or 7 years for legal compliance)

**Cost Savings:**
- S3 Standard: $0.023/GB/month
- S3 Glacier: $0.004/GB/month (80% cheaper)

---

## Cost Estimation

### Storage Costs (per month)

| Content Type | Size | S3 Standard | S3 Glacier | Total |
|-------------|------|-------------|------------|-------|
| Manuscripts (100 books @ 5MB) | 500MB | $0.01 | - | $0.01 |
| Published ebooks (100 @ 10MB) | 1GB | $0.02 | - | $0.02 |
| Audiobooks (50 @ 100MB) | 5GB | $0.12 | - | $0.12 |
| Public assets (covers, previews) | 2GB | $0.05 | - | $0.05 |
| Print files (50 @ 50MB) | 2.5GB | $0.06 | - | $0.06 |
| **Total Storage** | **11GB** | **$0.26** | - | **$0.26/month** |

### Bandwidth Costs

| Activity | Volume | Cost | Total |
|---------|--------|------|-------|
| Ebook downloads (100/month @ 10MB) | 1GB | $0.09/GB | $0.09 |
| Audiobook downloads (20/month @ 100MB) | 2GB | $0.09/GB | $0.18 |
| Cover image views (10,000/month @ 200KB) | 2GB | $0.09/GB | $0.18 |
| **Total Bandwidth** | **5GB** | - | **$0.45/month** |

### CloudFront CDN (Optional)

| Traffic | Cost |
|---------|------|
| First 10TB/month | $0.085/GB |
| Typical usage (5GB/month) | ~$0.43/month |

### **Total Monthly Cost Estimate**

**Without CloudFront:** ~$1/month (starting out)
**With CloudFront:** ~$2/month (better performance)

**At scale (1000 books, 1000 downloads/month):** ~$20-50/month

---

## Security Best Practices

### 1. Never Commit AWS Credentials to Git

Add to `.gitignore`:
```
.env.local
.env*.local
aws-credentials.txt
```

### 2. Rotate Access Keys Regularly

- Every 90 days, create new access keys
- Update `.env.local`
- Delete old keys

### 3. Enable MFA for AWS Account

- Go to IAM → Users → Security credentials
- Activate MFA (use Google Authenticator or Authy)

### 4. Monitor S3 Usage

- Set up CloudWatch alarms for unexpected spikes
- Enable S3 access logging
- Review monthly bill

### 5. Backup Critical Files

- Enable versioning on all buckets ✓ (already done)
- Consider cross-region replication for disaster recovery
- Export important files to local backup quarterly

---

## Troubleshooting

### Error: "Access Denied" when uploading

**Cause:** IAM policy missing permissions
**Fix:**
1. Go to IAM → Users → soullab-publishing-api → Permissions
2. Verify `SoullabPublishingS3Access` policy is attached
3. Check bucket names match in policy

### Error: "Bucket name already exists"

**Cause:** Bucket names are globally unique
**Fix:** Add a unique suffix like your name or random string:
- `soullab-manuscripts-yourname-2025`
- `soullab-manuscripts-a1b2c3d4`

### CloudFront shows 403 Forbidden

**Cause:** Bucket policy not allowing public access
**Fix:**
1. Go to S3 bucket → Permissions
2. Verify bucket policy allows `s3:GetObject` for `Principal: "*"`

### High bandwidth costs

**Cause:** Large files being downloaded frequently
**Fix:**
1. Use CloudFront CDN (caches files closer to users)
2. Compress images (use WebP format, smaller file sizes)
3. Implement download limits (3 downloads per purchase)

---

## Next Steps

After S3 is set up:

1. **Build file upload API** - `/api/publishing/upload`
2. **Implement signed URL generation** - For secure downloads
3. **Create cover upload flow** - Drag & drop interface
4. **Build manuscript converter** - DOCX → EPUB/MOBI
5. **Test end-to-end purchase flow** - Upload → Publish → Buy → Download

---

## Quick Reference

### Useful AWS CLI Commands

```bash
# Install AWS CLI
brew install awscli

# Configure credentials
aws configure

# List buckets
aws s3 ls

# Upload file
aws s3 cp myfile.pdf s3://soullab-manuscripts-prod-2025/test/

# Download file
aws s3 cp s3://soullab-published-content-prod-2025/ebook.epub ./

# Sync directory
aws s3 sync ./local-folder s3://bucket-name/folder/
```

### Environment Variables Summary

```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-2
AWS_S3_BUCKET_MANUSCRIPTS=soullab-manuscripts-prod-2025
AWS_S3_BUCKET_PUBLISHED=soullab-published-content-prod-2025
AWS_S3_BUCKET_PUBLIC=soullab-public-assets-prod-2025
AWS_S3_BUCKET_PRINT=soullab-print-ready-prod-2025
AWS_CLOUDFRONT_DOMAIN=d123456abcdef.cloudfront.net
```

---

**Ready to set up S3? Follow steps 1-7 and you'll have production-ready file storage for Soullab Publishing!** 🚀☁️
