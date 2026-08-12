# Sean Fargose — Cloud Engineer Portfolio

A recruiter-focused static portfolio for cloud engineering, enterprise Azure operations, VMware-to-Azure migration, DevOps, automation, distributed systems, research, and AI-powered FinOps.

## What is included

- Modern dark/light theme with persistent preference
- Animated 3D-style cloud/network particle background
- Interactive hero parallax and floating cloud/DevOps chips
- Cloud operations proof panel with production-style metrics
- Enterprise experience timeline covering Azure operations and AVS migration
- Featured AI-Powered Multi-Cloud Cost Intelligence case study
- Interactive gallery using the three latest project dashboard screenshots
- AI/FinOps architecture and savings metrics
- Responsive design and reduced-motion accessibility support
- Research section and direct professional links
- EmailJS contact form
- Custom 404 page
- Optional GitHub Actions → AWS S3 deployment using GitHub OIDC

## Local preview

```bash
cd website
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Vercel deployment

The portfolio is a static site, so Vercel can deploy it without a build framework. When importing the repository into Vercel, set **Root Directory** to `website` and leave the build command empty. Vercel will serve `index.html` directly.

The custom `404.html` is included for static hosting.

## Optional AWS CI/CD showcase

The repository retains an optional AWS deployment workflow to demonstrate cloud CI/CD and IAM/OIDC knowledge. It is manual-only so the Vercel deployment can remain the primary hosting path without creating failing GitHub checks when AWS secrets are not configured.

Required GitHub repository secrets if you want to use it:

- `AWS_DEPLOY_ROLE_ARN` — IAM role trusted by GitHub Actions OIDC
- `AWS_S3_BUCKET` — target S3 bucket
- `AWS_REGION` — AWS region

The workflow uses `aws-actions/configure-aws-credentials@v4` and short-lived OIDC credentials instead of long-lived AWS access keys.

## Portfolio structure

```text
.
├── .github/workflows/deploy.yml
├── website/
│   ├── index.html
│   ├── 404.html
│   └── src/
│       ├── app.js
│       ├── img/
│       │   ├── ai-cost-dashboard-1.png
│       │   ├── ai-cost-dashboard-2.png
│       │   └── ai-cost-dashboard-3.png
│       └── styles/
│           ├── styles.css
│           └── styles.scss
└── README.md
```

## Contact form

EmailJS is used from the browser. The public key can be exposed client-side, but the EmailJS service/template should be protected with domain restrictions and appropriate anti-spam/rate-limit controls.

## Confidentiality

Enterprise client descriptions should remain limited to information that is approved for public disclosure. Do not add internal architecture diagrams, credentials, URLs, monitoring screenshots, or confidential operational details.


## Recent UX upgrades

- Mobile-safe dark/light theme toggle with persistent preference and system-theme fallback
- Touch-friendly mobile navigation menu
- Scroll progress indicator
- Interactive Cloud Ops incident-response mini game
- More responsive touch targets and focus states
- Subtle 3D card tilt on pointer devices
- Reduced-motion support retained
