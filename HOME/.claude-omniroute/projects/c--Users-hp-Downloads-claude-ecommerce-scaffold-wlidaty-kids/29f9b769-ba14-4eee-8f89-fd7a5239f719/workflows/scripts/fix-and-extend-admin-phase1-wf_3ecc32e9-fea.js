export const meta = {
  name: 'fix-and-extend-admin-phase1',
  description: 'Connect storefront to database, fix product edit/delete, and add category management',
  phases: [
    { title: 'Database Migration & Storefront Switch', detail: 'Migrate schema for soft delete / categories and switch storefront pages to lib/catalog.ts' },
    { title: 'Admin Product Edit & Delete', detail: 'Implement product edit and soft/hard delete actions and UI' },
    { title: 'Admin Category Management', detail: 'Implement category create/edit/delete actions and UI' }
  ]
}

phase('Database Migration & Storefront Switch')
const migrationResult = await agent('Check schema.prisma for soft delete / deletedAt on Product and category management needs, update prisma/schema.prisma if needed, and rewrite storefront pages (app/page.tsx, app/shop/page.tsx, app/categories/[slug]/page.tsx, app/products/[slug]/page.tsx) to query database via lib/catalog.ts instead of static store-catalog.ts.', {
  label: 'storefront-db-switch',
  phase: 'Database Migration & Storefront Switch',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      details: { type: 'string' }
    },
    required: ['success', 'details']
  }
})

phase('Admin Product Edit & Delete')
const productActionsResult = await agent('Implement admin product edit (app/admin/products/[id]/edit/page.tsx) and soft/hard delete actions in lib/admin.ts and app/admin/products/page.tsx, with revalidatePath for instant storefront sync.', {
  label: 'product-edit-delete',
  phase: 'Admin Product Edit & Delete',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      details: { type: 'string' }
    },
    required: ['success', 'details']
  }
})

phase('Admin Category Management')
const categoryActionsResult = await agent('Implement category list, create, and edit management screens under app/admin/categories/ with robust server actions in lib/admin.ts.', {
  label: 'category-management',
  phase: 'Admin Category Management',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      details: { type: 'string' }
    },
    required: ['success', 'details']
  }
})

return { migrationResult, productActionsResult, categoryActionsResult }
