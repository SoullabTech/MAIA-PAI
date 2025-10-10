export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-8 text-[#d4b896]">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Overview</h2>
            <p>
              MAIA (Multidimensional Adaptive Intelligence Archetypal) and Elemental Oracle 2.0
              are designed to provide personalized archetypal guidance and transformational support.
              Your privacy and the sacred nature of your journey are our highest priorities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Conversation history with MAIA</li>
              <li>AIN (Adaptive Intelligence Network) memory data including:</li>
              <ul className="list-circle list-inside ml-6 space-y-1">
                <li>Spiral phase progression</li>
                <li>Elemental balance patterns</li>
                <li>Active archetypes and symbolic threads</li>
                <li>Ritual history and preferences</li>
              </ul>
              <li>Voice interaction analytics (if voice mode is used)</li>
              <li>AI model performance metrics (response times, token usage)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide personalized archetypal guidance</li>
              <li>To maintain conversation continuity across sessions</li>
              <li>To improve MAIA's responses and the Elemental Oracle framework</li>
              <li>To analyze aggregate patterns for system improvements (anonymized)</li>
              <li>To ensure safety and crisis support when needed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Data Storage & Security</h2>
            <p>
              Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit.
              All conversations and memory data are associated with your user ID and protected by
              row-level security policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Third-Party Services</h2>
            <p>We use the following third-party services to provide MAIA's capabilities:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>OpenAI (GPT-4o, GPT-5):</strong> AI model processing for conversational responses</li>
              <li><strong>Anthropic (Claude):</strong> AI model processing for depth conversations</li>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>ElevenLabs:</strong> Text-to-speech for voice interactions (if enabled)</li>
            </ul>
            <p className="mt-2">
              These services process your messages to generate responses but do not retain your data
              beyond their standard retention policies. Please review their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your stored conversation history and AIN memory</li>
              <li>Request deletion of your data at any time</li>
              <li>Export your data in JSON format</li>
              <li>Opt out of analytics tracking (voice metrics will still be collected for functionality)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Custom GPT Integration</h2>
            <p>
              When you interact with MAIA through ChatGPT's Custom GPT interface, your messages
              are sent to our API endpoints. We collect the same information as described above,
              plus your ChatGPT user identifier for session continuity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Analytics</h2>
            <p>
              We collect anonymous analytics about system performance, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>AI model response times and costs</li>
              <li>Conversation mode effectiveness (walking vs classic vs adaptive)</li>
              <li>Voice interaction quality (if voice is used)</li>
              <li>Aggregate brevity and engagement metrics</li>
            </ul>
            <p className="mt-2">
              These analytics are used solely to improve MAIA's performance and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Crisis & Safety</h2>
            <p>
              If MAIA detects potential crisis situations (self-harm, suicide ideation), we may
              temporarily store additional context to ensure continuity of care and appropriate
              escalation to professional resources.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Significant changes will be
              communicated through the app. Continued use after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-light mb-4 text-[#d4b896]">Contact</h2>
            <p>
              For privacy-related questions or to exercise your data rights, please contact us at:<br />
              <a href="mailto:privacy@yourdomain.com" className="text-[#d4b896] hover:underline">
                privacy@yourdomain.com
              </a>
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-800 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}
