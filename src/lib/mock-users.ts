import { User, ROLES } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-admin-01',
    username: 'Super Admin',
    role: ROLES.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=admin01',
  },
  {
    id: 'user-manager-01',
    username: 'Ana Kovacevic',
    role: ROLES.MANAGER,
    avatarUrl: 'https://i.pravatar.cc/150?u=manager01',
  },
  {
    id: 'user-driver-01',
    username: 'Miloš Petrović',
    role: ROLES.DRIVER,
    avatarUrl: 'https://i.pravatar.cc/150?u=driver01',
    associatedItemIds: ['ITM-001'],
  },
  {
    id: 'user-driver-02',
    username: 'Stefan Vasić',
    role: ROLES.DRIVER,
    avatarUrl: 'https://i.pravatar.cc/150?u=driver02',
    associatedItemIds: ['ITM-003', 'ITM-004'],
  },
  {
    id: 'user-client-01',
    username: 'PharmaCorp',
    role: ROLES.CLIENT,
    avatarUrl: 'https://i.pravatar.cc/150?u=client01',
    associatedItemIds: ['ITM-002'],
  },
  {
    id: 'user-client-02',
    username: 'TechElec Inc.',
    role: ROLES.CLIENT,
    avatarUrl: 'https://i.pravatar.cc/150?u=client02',
    associatedItemIds: ['ITM-004'],
  },
];

export const findUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
};

export const findUserById = (id: string): User | undefined => {
    return mockUsers.find(user => user.id === id);
};
