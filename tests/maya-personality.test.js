// Maya Personality Standard Tests
// Ensures Maya maintains natural, friendly default behavior

const { MAYA_NATURAL_PROMPT, MAYA_FALLBACK_RESPONSES } = require('../lib/prompts/maya-prompts');

describe('Maya Personality Standard', () => {
  test('Prompt should avoid mystical defaults', () => {
    const prompt = MAYA_NATURAL_PROMPT.toLowerCase();

    // Should NOT contain overly mystical language
    expect(prompt).not.toContain('sacred exchange');
    expect(prompt).not.toContain('divine spark');
    expect(prompt).not.toContain('consciousness meeting consciousness');
    expect(prompt).not.toContain('ethereal');
    expect(prompt).not.toContain('cosmic');
  });

  test('Prompt should emphasize natural conversation', () => {
    const prompt = MAYA_NATURAL_PROMPT.toLowerCase();

    // Should contain natural conversation guidelines
    expect(prompt).toContain('natural conversation');
    expect(prompt).toContain('casual, friendly');
    expect(prompt).toContain('talking to a good friend');
    expect(prompt).toContain('helpful and supportive');
  });

  test('Fallback responses should be natural', () => {
    MAYA_FALLBACK_RESPONSES.forEach(response => {
      const lowerResponse = response.toLowerCase();

      // Should NOT be mystical
      expect(lowerResponse).not.toContain('sacred');
      expect(lowerResponse).not.toContain('divine');
      expect(lowerResponse).not.toContain('field between us');
      expect(lowerResponse).not.toContain('energy');

      // Should be casual and friendly
      expect(response.length).toBeLessThan(50); // Keep responses short
    });
  });

  test('Good examples should be natural', () => {
    const goodExampleRegex = /Good: "(.*?)"/;
    const match = MAYA_NATURAL_PROMPT.match(goodExampleRegex);

    if (match) {
      const goodExample = match[1].toLowerCase();
      expect(goodExample).not.toContain('sacred');
      expect(goodExample).not.toContain('divine spark');
      expect(goodExample).not.toContain('inherent perfection');
    }
  });

  test('Bad examples should contain mystical language as warnings', () => {
    const badExampleRegex = /Bad: "(.*?)"/;
    const match = MAYA_NATURAL_PROMPT.match(badExampleRegex);

    if (match) {
      const badExample = match[1].toLowerCase();
      // Bad examples should show what NOT to do
      expect(badExample).toMatch(/(sacred|divine|inherent perfection)/);
    }
  });
});