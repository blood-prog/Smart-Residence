// Role constants and mappings for the multi-admin system

export type AdminRole = 'admin' | 'director' | 'sports_dept' | 'maintenance_dept' | 'housing_dept';

export const ADMIN_ROLES: AdminRole[] = ['admin', 'director', 'sports_dept', 'maintenance_dept', 'housing_dept'];

export const ROLE_LABELS: Record<string, string> = {
  student: 'طالب',
  admin: 'مدير الإقامة',
  director: 'مدير الإقامة',
  sports_dept: 'مسؤول مصلحة النشاطات',
  maintenance_dept: 'مسؤول مصلحة الصيانة',
  housing_dept: 'مسؤول مصلحة الإيواء',
};

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  admin: '/admin/director',
  director: '/admin/director',
  sports_dept: '/admin/sports',
  maintenance_dept: '/admin/maintenance',
  housing_dept: '/admin/housing',
};

export const ROLE_SIDEBAR_LABELS: Record<string, string> = {
  admin: 'لوحة المدير العام',
  director: 'لوحة المدير العام',
  sports_dept: 'إدارة النشاطات',
  maintenance_dept: 'إدارة الصيانة',
  housing_dept: 'إدارة الإيواء',
};

export function isAdminRole(role: string | null | undefined): boolean {
  return ADMIN_ROLES.includes(role as AdminRole);
}

export function getRoleLabel(role: string | null | undefined): string {
  return ROLE_LABELS[role || 'student'] || 'طالب';
}

export function getAdminRoute(role: string | null | undefined): string {
  return ROLE_DASHBOARD_ROUTES[role || ''] || '/dashboard';
}
