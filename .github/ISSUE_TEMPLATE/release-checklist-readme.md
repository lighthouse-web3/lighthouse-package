---
name: "Production Release Checklist Readme"
about: "Use this checklist when pushing new SDK / Backend / Frontend updates to production."
title: "Release: vX.Y.Z"
labels: [release, deployment]
---

# 🚀 Production Release Checklist (SDK / Backend / Frontend)

- [ ] Confirm scope & rollback plan — define what’s shipping, owner, and rollback path.  
- [ ] Run full tests — unit, integration, and key E2E flows must pass.  
- [ ] Verify backward compatibility — old SDKs, APIs, and UI still function.  
- [ ] Update version numbers — follow Semantic Versioning (`major.minor.patch`).  
- [ ] Check migrations & data safety — backups verified, rollback ready.  
- [ ] Staging validation — test login, payments, uploads, core flows.  
- [ ] Prepare release notes — summary, breaking changes, docs link.  
- [ ] Notify users/community — Email, Discord, Telegram, X post.  
- [ ] Deploy in correct order — Backend → SDK → Frontend; monitor metrics.  
- [ ] Post-deploy sanity check — test live app, monitor 24–48 hrs.  
- [ ] Announce live release — pin message, share changelog link.  
- [ ] Cleanup & reflect — remove temp flags, document learnings.  
