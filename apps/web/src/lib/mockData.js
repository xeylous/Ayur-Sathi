// Mock Data representing data pulled from DB/Blockchain
export const mockBatches = [
  { id: 'B4530', farmerId: 'F-802', herb: 'Ashwagandha', qaStatus: 'Lab Approved', price: 12000, paymentStatus: 'Pending', marketplaceStatus: 'Pending Admin Approval' },
  { id: 'B4521', farmerId: 'F-805', herb: 'Tulsi', qaStatus: 'Lab Approved', price: 8500, paymentStatus: 'Paid', marketplaceStatus: 'Pending Admin Approval' }, 
  { id: 'B4512', farmerId: 'F-801', herb: 'Brahmi', qaStatus: 'Lab Approved', price: 15000, paymentStatus: 'Paid', marketplaceStatus: 'Live' },
  { id: 'B4500', farmerId: 'F-800', herb: 'Neem', qaStatus: 'Lab Rejected', price: 0, paymentStatus: 'N/A', marketplaceStatus: 'Rejected' }, 
];

export const mockUsers = [
  { id: 'U1001', role: 'Consumer', status: 'Active', registrationDate: '2025-08-01' },
  { id: 'F00802', role: 'Farmer', status: 'Active', registrationDate: '2025-07-15' },
  { 
    id: 'L003', role: 'Laboratory', status: 'Pending Approval', registrationDate: '2025-09-20',
    applicationDetails: {
      labName: "Himalayan Herbal Testing Labs",
      contactPerson: "Dr. Anjali Sharma",
      phone: "+91-98765-43210",
      address: "Plot 14, BioPark R&D Zone, Dehradun, Uttarakhand, 248001",
      accreditation: "NABL Certified (Chemistry & Microbiology)",
      specialty: "Heavy Metals, Pesticide Residue, Microbial Analysis",
      documentsUploaded: ['NABL Certificate PDF', 'Technical Staff List', 'Facility Floor Plan'],
      mouRequestDate: '2025-09-15',
      email: 'anjali.sharma@himalabs.in'
    }
  },
  { 
    id: 'L004', role: 'Laboratory', status: 'Active', registrationDate: '2025-08-10',
    applicationDetails: {
      labName: "Ayush QA Center",
      contactPerson: "Rajesh Kulkarni",
      phone: "+91-99998-88877",
      address: "Unit 301, Tech Hub, Mumbai, Maharashtra, 400072",
      accreditation: "ISO 17025 Compliant",
      specialty: "DNA Barcoding, Adulteration Testing",
      documentsUploaded: ['ISO Certificate', 'Business License'],
      mouRequestDate: '2025-08-01',
      email: 'rajesh.k@ayushqa.in'
    }
  },
  { id: 'U1002', role: 'Consumer', status: 'Inactive', registrationDate: '2025-08-10' },
];
