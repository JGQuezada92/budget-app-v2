# 🤖 AI Analysis Setup Guide

## ⚠️ CRITICAL: API Key Required for AI Analysis

The application is **fully functional** with real Claude AI integration, but you **MUST** configure your API key for it to work.

---

## 🔑 Step 1: Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to **API Keys** section
4. Click **"Create Key"**
5. Copy your API key (starts with `sk-ant-`)

---

## 📝 Step 2: Configure Your Environment File

1. Open `.env.local` in the project root directory
2. Replace `your-actual-api-key-here` with your real API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file

---

## ✅ Step 3: Restart the Development Server

After updating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

Or use the startup script:
```powershell
.\start-dev.ps1
```

---

## 🧪 Step 4: Test the AI Analysis

1. Navigate to http://localhost:3000
2. Go to **"New Submission"**
3. Fill out the form sections (at minimum):
   - **Section 1**: Department name, team description
   - **Section 2**: Add at least 1-2 metrics
   - **Section 4**: Add at least 1 initiative
   - **Section 6**: Upload sample financial data (optional but recommended)
4. Click **"Submit for Review"**
5. Check the browser console (F12) for AI analysis logs

### Expected Console Output:

```
═══════════════════════════════════════════════════════════════
🔍 AI ANALYSIS REQUEST STARTED
═══════════════════════════════════════════════════════════════
🏢 Department: Finance
📅 Fiscal Year: FY2027
📊 Business Metrics Count: 3
🤖 AI Metrics Count: 2
📋 Initiatives Count: 4
═══════════════════════════════════════════════════════════════
📏 Prompt Length: 15234 characters
🚀 Sending to Claude API...
✅ Received response from Claude
📏 Response Length: 8745 characters
═══════════════════════════════════════════════════════════════
✨ PARSED AI RESPONSE
═══════════════════════════════════════════════════════════════
💡 Insights: 6
✅ Recommendations: 7
⚠️  Risks: 5
🎯 Opportunities: 4
📊 KPI Suggestions: 3
🤖 AI Readiness Score: 65/100
📈 Confidence Score: 85/100
═══════════════════════════════════════════════════════════════
```

---

## 🛠 Troubleshooting

### Issue: "Failed to analyze submission" error

**Cause:** Invalid or missing API key

**Solution:**
1. Check that `.env.local` exists
2. Verify API key is correct (starts with `sk-ant-`)
3. Ensure no extra spaces or quotes around the key
4. Restart the development server

### Issue: "Authentication error" in console

**Cause:** Invalid API key

**Solution:**
1. Generate a new API key from Anthropic Console
2. Update `.env.local` with the new key
3. Restart server

### Issue: AI analysis not appearing on dashboard

**Cause:** Analysis may have failed silently, or no financial data provided

**Solution:**
1. Check browser console (F12) for errors
2. Ensure you uploaded financial data in Section 6
3. Try submitting again
4. Check that `.env.local` is configured correctly

### Issue: "Rate limit exceeded"

**Cause:** Too many API calls in short time (free tier limit)

**Solution:**
1. Wait a few minutes before trying again
2. Consider upgrading Anthropic API plan
3. Check usage at https://console.anthropic.com/

---

## 📊 What the AI Analysis Does

The AI analysis uses Claude Sonnet 4 to provide:

1. **Executive Summary** - Overall budget feasibility assessment
2. **Key Insights** (5-7) - Critical findings from your data
3. **Recommendations** (5-7) - Actionable budget optimization advice
4. **Risk Assessment** (4-5) - Potential concerns and red flags
5. **Opportunities** (3-4) - Areas for improvement
6. **KPI Suggestions** (3-4) - Better metrics for tracking performance
7. **AI Readiness Score** (0-100) - Department's AI maturity level
8. **Confidence Score** (0-100) - Analysis reliability based on data quality

### The Analysis Framework Includes:

✅ **3-Dimensional Analysis:**
- Quantitative financial variance analysis
- Qualitative narrative and strategic assessment  
- KPI evaluation and enhancement suggestions

✅ **Department-Specific Insights:**
- Tailored to your actual department type
- References your specific metrics by name
- Evaluates your actual initiatives

✅ **AI Strategy Evaluation:**
- Reviews AI adoption plans
- Assesses productivity improvement claims
- Validates AI cost-benefit analysis
- Evaluates workforce planning

---

## 💰 API Cost Information

**Claude Sonnet 4 Pricing (as of FY27):**
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

**Typical Cost Per Analysis:**
- Input tokens: ~5,000 tokens (~$0.015)
- Output tokens: ~3,000 tokens (~$0.045)
- **Total per submission: ~$0.06**

With the free tier ($5 credit), you can run ~80 analyses.

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Don't share API keys** - Each developer should have their own
3. **Rotate keys regularly** - Generate new keys every 90 days
4. **Use environment-specific keys** - Different keys for dev/staging/prod
5. **Monitor usage** - Check Anthropic Console for unexpected usage

---

## 📖 Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Model Comparison](https://docs.anthropic.com/claude/docs/models-overview)
- [API Pricing](https://www.anthropic.com/pricing)
- [Best Practices Guide](https://docs.anthropic.com/claude/docs/best-practices)

---

## ✅ Verification Checklist

Before submitting a real budget proposal:

- [ ] API key is configured in `.env.local`
- [ ] Server is running without errors
- [ ] Test submission completes successfully
- [ ] AI analysis appears in browser console
- [ ] Dashboard shows analysis results
- [ ] All 7 form sections are complete
- [ ] Financial data files are uploaded
- [ ] Metrics are defined with realistic values
- [ ] Initiatives have cost estimates
- [ ] AI strategy section is completed

---

**Last Updated:** October 23, 2025  
**Status:** AI Integration Fully Functional ✅


