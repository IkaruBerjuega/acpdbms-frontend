export type Project = {
  id: string;
  project_title: string;
  client_name: string;
  location: string;
  start_date: string;
  end_date: string;
  project_status: 'finished' | 'on-hold' | 'ongoing' | 'cancelled' | 'archived';
};

export const projects: Project[] = [
  {
    id: 'GLP-1001',
    project_title: 'Sunrise Residences',
    client_name: 'Juan Dela Cruz',
    location: 'Quezon City, Philippines',
    start_date: '2023-02-15',
    end_date: '2024-06-30',
    project_status: 'ongoing',
  },
  {
    id: 'GLP-1002',
    project_title: 'Skyline Tower',
    client_name: 'Carlos Mendoza',
    location: 'Makati City, Philippines',
    start_date: '2022-10-01',
    end_date: '2025-03-15',
    project_status: 'on-hold',
  },
];
