export const meta = {
  name: 'bugfix-review-loop',
  description: 'Multi-agent review and fix loop for Kids Maroc store admin and database integration',
  phases: [
    { title: 'Review', detail: 'Independent review agents analyzing security, auth, DB relations, and storefront sync' },
    { title: 'Fix & Verify', detail: 'Applying fixes for confirmed findings and running quality gates' }
  ]
}

phase('Review')
const findings = await agent('Review codebase for security vulnerabilities, permission gaps on admin routes, Prisma relation/transaction issues, and storefront synchronization with the database.', {
  label: 'codebase-audit',
  phase: 'Review',
  schema: {
    type: 'object',
    properties: {
      issues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            severity: { type: 'string' },
            file: { type: 'string' },
            description: { type: 'string' },
            fix: { type: 'string' }
          },
          required: ['id', 'severity', 'file', 'description', 'fix']
        }
      }
    },
    required: ['issues']
  }
})

phase('Fix & Verify')
const fixResult = await agent('Analyze findings and confirm test coverage and clean builds.', {
  label: 'fix-verifier',
  phase: 'Fix & Verify',
  schema: {
    type: 'object',
    properties: {
      status: { type: 'string' },
      summary: { type: 'string' }
    },
    required: ['status', 'summary']
  }
})

return { findings, fixResult }