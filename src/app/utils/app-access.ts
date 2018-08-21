/**
 * Roles array to define which roles have access to which pages, buttons, tabs, buttons, etc...
 */

export function hasFunctionalityAccess(
  role: string,
  functionality: string
): boolean {
  return true
}

export function pageAccess(role: string | undefined): Auth.IPageAccess {
  if (role) {
    isValidRole(role)
    return roles[role].pageAccess
  }
  return {}
}

export function navAccess(role: string | undefined): Auth.INavAccess {
  if (role) {
    isValidRole(role)
    return roles[role].navAccess
  }
  return {}
}

function isValidRole(role: string): void {
  if (!roles[role]) throw new Error(`Invalid Role: ${role}`)
}

const allPages: Auth.IPageAccess = {
  AccountSettingsPage: true,
  CrmPage: true,
  CustomFieldsPage: true,
  DealsIndexPage: true,
  DealsShowPage: true,
  EmailTemplatePage: true,
  EmailTemplatesPage: true,
  GroupsPage: true,
  IntegrationPage: true,
  JourneyPage: true,
  JourneysPage: true,
  PipelinesPage: true,
  TeamMembersPage: true,
  TextTemplatePage: true,
  TextTemplatesPage: true
}

const allNavs: Auth.INavAccess = {
  Automation: true,
  Crm: true,
  Deals: true,
  Email: true,
  Settings: true,
  Text: true
}

const roles: Auth.IRoles = {
  admin: {
    functionalityAccess: {},
    navAccess: allNavs,
    pageAccess: allPages
  },
  sales_rep: {
    functionalityAccess: {},
    navAccess: {
      Crm: true,
      Deals: true
    },
    pageAccess: {
      CrmPage: true,
      DealsIndexPage: true,
      DealsShowPage: true
    }
  }
}
