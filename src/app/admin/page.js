"use client";
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, DollarSign, FlaskConical, CheckCircle, Clock, ShoppingCart, TrendingUp, XCircle, FileText, Banknote, QrCode, ClipboardList, Phone, MapPin, User, FileText as FileIcon } from 'lucide-react';

// Mock Data representing data pulled from the database/blockchain
// Note: In a real implementation, this would be fetched from Firestore/Blockchain
const mockBatches = [
    { id: 'B4530', farmerId: 'F-802', herb: 'Ashwagandha', qaStatus: 'Lab Approved', price: 12000, paymentStatus: 'Pending', marketplaceStatus: 'Pending Admin Approval' },
    { id: 'B4521', farmerId: 'F-805', herb: 'Tulsi', qaStatus: 'Lab Approved', price: 8500, paymentStatus: 'Paid', marketplaceStatus: 'Pending Admin Approval' }, 
    { id: 'B4512', farmerId: 'F-801', herb: 'Brahmi', qaStatus: 'Lab Approved', price: 15000, paymentStatus: 'Paid', marketplaceStatus: 'Live' },
    { id: 'B4500', farmerId: 'F-800', herb: 'Neem', qaStatus: 'Lab Rejected', price: 0, paymentStatus: 'N/A', marketplaceStatus: 'Rejected' }, 
];

const mockUsers = [
    { id: 'U1001', role: 'Consumer', status: 'Active', registrationDate: '2025-08-01' },
    { id: 'F00802', role: 'Farmer', status: 'Active', registrationDate: '2025-07-15' },
    // Pending Lab Account
    { 
        id: 'L003', 
        role: 'Laboratory', 
        status: 'Pending Approval', 
        registrationDate: '2025-09-20',
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
    // Approved Lab Account
    { 
        id: 'L004', 
        role: 'Laboratory', 
        status: 'Active', 
        registrationDate: '2025-08-10',
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

// Main Admin Component
const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [batches, setBatches] = useState(mockBatches);
    const [users, setUsers] = useState(mockUsers);
    const [statusMessage, setStatusMessage] = useState(null);
    const [selectedLab, setSelectedLab] = useState(null); // State for modal data

    // --- Utility Functions ---

    const showStatus = (message, isSuccess = false) => {
        setStatusMessage({ message, isSuccess });
        setTimeout(() => setStatusMessage(null), 5000);
    };

    // --- Action Handlers ---

    const handleFarmerPayment = (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch.qaStatus !== 'Lab Approved' || batch.paymentStatus !== 'Pending') {
            showStatus(`Error: Batch ${batchId} is not ready for payment. Must be 'Lab Approved' and 'Pending' payment.`, false);
            return;
        }

        const newBatches = batches.map(b => 
            b.id === batchId ? { ...b, paymentStatus: 'Paid', paymentDate: new Date().toLocaleDateString() } : b
        );
        setBatches(newBatches);
        showStatus(`SUCCESS! Payment of ₹${batch.price.toLocaleString('en-IN')} processed for Batch ${batchId} to Farmer ${batch.farmerId}.`, true);
    };

    const handleMarketplaceApproval = (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        if (batch.paymentStatus !== 'Paid' || batch.marketplaceStatus !== 'Pending Admin Approval') {
            showStatus(`Error: Batch ${batchId} is not fully processed (Payment Status: ${batch.paymentStatus}).`, false);
            return;
        }

        const newBatches = batches.map(b => 
            b.id === batchId ? { ...b, marketplaceStatus: 'Live', listedDate: new Date().toLocaleDateString() } : b
        );
        setBatches(newBatches);
        showStatus(`SUCCESS! Batch ${batchId} is now LIVE on the AyurSaathi Marketplace.`, true);
    };

    const handleUserApproval = (userId, newStatus) => {
        const user = users.find(u => u.id === userId);
        if (user.role !== 'Laboratory') {
            showStatus(`Error: Only Laboratory accounts require specific admin approval.`, false);
            return;
        }

        const newUsers = users.map(u => 
            u.id === userId ? { ...u, status: newStatus } : u
        );
        setUsers(newUsers);
        
        // Close modal if open
        setSelectedLab(null);

        if (newStatus === 'Active') {
            showStatus(`SUCCESS! Laboratory ${userId} (${user.applicationDetails.labName}) has been officially approved.`, true);
        } else {
            showStatus(`Laboratory ${userId} (${user.applicationDetails.labName}) has been declined and marked as Inactive.`, false);
        }
    };
    
    // --- Render Components ---

    const Sidebar = () => (
        <aside className="w-64 bg-indigo-900 text-white p-6 shadow-2xl h-full fixed top-0 left-0">
            <div className="text-2xl font-bold mb-8 text-teal-300 flex items-center gap-2">
                <LayoutDashboard size={24} /> AyurSaathi Admin
            </div>
            <nav className="space-y-3">
                {[{ id: 'dashboard', icon: LayoutDashboard, label: 'Overview' }, { id: 'user', icon: Users, label: 'Lab Approvals' }, { id: 'farmerPayment', icon: DollarSign, label: 'Farmer Payments' }, { id: 'laboratory', icon: FlaskConical, label: 'Marketplace Listing' },].map(({ id, icon: Icon, label }) => (
                    <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === id ? 'bg-indigo-700 font-semibold border-l-4 border-amber-300' : 'hover:bg-indigo-800'}`}>
                        <Icon size={20} className="mr-3" />
                        {label}
                    </button>
                ))}
            </nav>
        </aside>
    );

    const StatusDisplay = () => {
        if (!statusMessage) return null;
        return (
            <div className={`fixed bottom-4 right-4 p-4 rounded-xl font-semibold shadow-2xl transition-opacity duration-300 z-50 ${statusMessage.isSuccess ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-red-100 text-red-800 border border-red-400'}`}>
                {statusMessage.isSuccess ? <CheckCircle size={16} className="inline mr-2" /> : <XCircle size={16} className="inline mr-2" />}
                {statusMessage.message}
            </div>
        );
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className={`p-6 rounded-xl shadow-md ${color}`}>
            <Icon size={32} className="mb-3 opacity-75" />
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm font-medium opacity-80 mt-1">{title}</p>
        </div>
    );
    
    const Dashboard = () => {
        const pendingLabs = users.filter(u => u.role === 'Laboratory' && u.status === 'Pending Approval').length;
        const pendingPayments = batches.filter(b => b.paymentStatus === 'Pending' && b.qaStatus === 'Lab Approved').length;
        const pendingListings = batches.filter(b => b.paymentStatus === 'Paid' && b.marketplaceStatus === 'Pending Admin Approval').length;

        return (
            <>
                <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard icon={TrendingUp} title="Total Batches" value={batches.length} color="bg-teal-100 text-teal-800" />
                    <StatCard icon={CheckCircle} title="Certified & Live" value={batches.filter(b => b.marketplaceStatus === 'Live').length} color="bg-green-100 text-green-800" />
                    <StatCard icon={DollarSign} title="Total Paid Out" value="₹ 4.5M" color="bg-indigo-100 text-indigo-800" />
                    <StatCard icon={Clock} title="Pending Payments" value={pendingPayments} color="bg-amber-100 text-amber-800" />
                </div>

                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center"><FileText size={20} className="mr-2" /> Action Required</h3>
                    <ul className="space-y-3">
                        <li className="p-3 bg-red-50 rounded-lg flex justify-between items-center text-red-800">
                            <span className="font-medium">{pendingLabs} Laboratory registration(s) requires approval.</span>
                            <button onClick={() => setActiveTab('user')} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">Review Labs &rarr;</button>
                        </li>
                        <li className="p-3 bg-amber-50 rounded-lg flex justify-between items-center text-amber-800">
                            <span className="font-medium">{pendingPayments} Batches ready for Farmer Payment disbursement.</span>
                            <button onClick={() => setActiveTab('farmerPayment')} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">Pay Farmers &rarr;</button>
                        </li>
                        <li className="p-3 bg-blue-50 rounded-lg flex justify-between items-center text-blue-800">
                            <span className="font-medium">{pendingListings} Batches ready for final Marketplace listing.</span>
                            <button onClick={() => setActiveTab('laboratory')} className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">List Herbs &rarr;</button>
                        </li>
                    </ul>
                </div>
            </>
        );
    };

    // New component for the detailed view of a lab application
    const LabDetailsModal = ({ lab, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="p-6 border-b flex justify-between items-center bg-indigo-50 rounded-t-xl">
                    <h3 className="text-xl font-bold text-indigo-800 flex items-center">
                        <ClipboardList size={24} className="mr-3" /> Application Details: {lab.applicationDetails.labName}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Modal Body (Details) */}
                <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-6">
                    {/* Basic Info */}
                    <DetailItem icon={FileIcon} label="Lab Name" value={lab.applicationDetails.labName} />
                    <DetailItem icon={User} label="Contact Person" value={lab.applicationDetails.contactPerson} />
                    <DetailItem icon={Phone} label="Contact Phone" value={lab.applicationDetails.phone} />
                    <DetailItem icon={Clock} label="Requested On" value={lab.registrationDate} />
                    
                    {/* Accreditation & Specialty */}
                    <DetailItem icon={FlaskConical} label="Accreditation" value={lab.applicationDetails.accreditation} fullWidth />
                    <DetailItem icon={ClipboardList} label="Testing Specialty" value={lab.applicationDetails.specialty} fullWidth />
                    
                    {/* Documents */}
                    <div className="col-span-2">
                        <p className="text-sm font-semibold text-gray-700 mb-2 mt-4 flex items-center"><FileIcon size={16} className="mr-2 text-indigo-600"/> Documents Uploaded</p>
                        <div className="flex flex-wrap gap-2">
                            {lab.applicationDetails.documentsUploaded.map(doc => (
                                <span key={doc} className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full border border-teal-300">
                                    {doc}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="col-span-2">
                         <p className="text-sm font-semibold text-gray-700 mb-2 mt-4 flex items-center"><MapPin size={16} className="mr-2 text-indigo-600"/> Address</p>
                         <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border">{lab.applicationDetails.address}</p>
                    </div>

                </div>

                {/* Modal Footer (Actions) */}
                <div className="p-6 bg-gray-50 border-t flex justify-end gap-3 rounded-b-xl">
                    <button 
                        onClick={() => handleUserApproval(lab.id, 'Inactive')}
                        className="flex items-center text-sm bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
                    >
                        <XCircle size={16} className="mr-2"/> Decline Lab
                    </button>
                    <button 
                        onClick={() => handleUserApproval(lab.id, 'Active')}
                        className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
                    >
                        <CheckCircle size={16} className="mr-2"/> Approve Lab
                    </button>
                </div>
            </div>
        </div>
    );

    const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => (
        <div className={fullWidth ? "col-span-2" : "col-span-1"}>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center">
                <Icon size={12} className="mr-1"/> {label}
            </p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    );
    
    const UserManagement = () => {
        // Filter: Show only Laboratories that are 'Pending Approval'
        const pendingLabs = users.filter(u => u.role === 'Laboratory' && u.status === 'Pending Approval');
        const activeLabs = users.filter(u => u.role === 'Laboratory' && u.status === 'Active');

        return (
            <>
                <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">Laboratory Approvals</h2>
                <p className="text-gray-600 mb-6">Review new applications from laboratories. View submitted details and documentation before granting them access to the quality assurance network.</p>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                    <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center"><Clock size={20} className="mr-2" /> Pending Applications ({pendingLabs.length})</h3>
                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Lab ID', 'Lab Name', 'Contact', 'Reg. Date', 'Details', 'Action'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingLabs.map((lab) => (
                                <tr key={lab.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{lab.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lab.applicationDetails.labName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lab.applicationDetails.contactPerson}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lab.registrationDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => setSelectedLab(lab)}
                                            className="text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold p-2 rounded-lg flex items-center transition-colors shadow-sm"
                                        >
                                            <ClipboardList size={14} className="mr-1"/> View Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button 
                                            onClick={() => handleUserApproval(lab.id, 'Active')}
                                            className="text-white bg-green-600 hover:bg-green-700 text-xs font-semibold p-2 rounded-lg shadow-sm"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleUserApproval(lab.id, 'Inactive')}
                                            className="text-white bg-red-600 hover:bg-red-700 text-xs font-semibold p-2 rounded-lg shadow-sm"
                                        >
                                            Decline
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingLabs.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-6 text-center text-gray-500 italic">All pending laboratory applications have been processed.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold text-green-800 mb-4 mt-8 pt-4 border-t"><CheckCircle size={20} className="inline mr-2" /> Approved Labs ({activeLabs.length})</h3>
                    <ul className="space-y-2">
                        {activeLabs.map(lab => (
                            <li key={lab.id} className="p-3 bg-green-50 rounded-lg text-sm flex justify-between items-center border border-green-200">
                                <span>**{lab.applicationDetails.labName}** ({lab.id}) - Approved on {lab.registrationDate}</span>
                                <span className="text-xs text-green-600 font-semibold">Active</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Render Modal */}
                {selectedLab && <LabDetailsModal lab={selectedLab} onClose={() => setSelectedLab(null)} />}
            </>
        );
    };


    const FarmerPaymentControl = () => {
        // Only show batches that are Lab Approved but payment is Pending
        const pendingBatches = batches.filter(b => b.paymentStatus === 'Pending' && b.qaStatus === 'Lab Approved');
        return (
            <>
                <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">Farmer Payment Disbursement</h2>
                <p className="text-gray-600 mb-6">Approve and disburse funds to farmers for their **Lab Approved** batches (geotagged herbs) via blockchain transaction. This step must precede marketplace listing.</p>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Batch ID', 'Farmer ID', 'Herb', 'QA Status', 'Payment Amount', 'Payment Status', 'Action'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingBatches.map((batch) => (
                                <tr key={batch.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center"><QrCode size={14} className="mr-2 text-gray-500"/>{batch.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.farmerId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.herb}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800">
                                            {batch.qaStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">₹ {batch.price.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 rounded-full bg-amber-100 text-amber-800`}>
                                            {batch.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleFarmerPayment(batch.id)}
                                            className="flex items-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
                                        >
                                            <Banknote size={16} className="mr-2"/> Initiate Payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingBatches.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 italic">No batches currently pending farmer payment.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };


    const LabMarketplaceControl = () => {
        // Only show batches that are Paid and Pending Admin Approval
        const readyForMarket = batches.filter(b => b.paymentStatus === 'Paid' && b.marketplaceStatus === 'Pending Admin Approval');
        const liveBatches = batches.filter(b => b.marketplaceStatus === 'Live');

        return (
            <>
                <h2 className="text-3xl font-extrabold text-indigo-800 mb-6">Marketplace Listing Control</h2>
                <p className="text-gray-600 mb-6">Final step: Review **Paid** and **Lab Certified** batches. Admin approves the final listing onto the consumer marketplace.</p>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Batch ID', 'Herb', 'Price', 'Payment Status', 'Lab Status', 'Marketplace Status', 'Action'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {readyForMarket.map((batch) => (
                                <tr key={batch.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{batch.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.herb}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">₹ {batch.price.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-green-100 text-green-800">
                                            {batch.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-teal-100 text-teal-800">
                                            {batch.qaStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-amber-100 text-amber-800">
                                            {batch.marketplaceStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleMarketplaceApproval(batch.id)}
                                            className="flex items-center text-sm bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md"
                                        >
                                            <ShoppingCart size={16} className="mr-2"/> Approve & List
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {liveBatches.map((batch) => (
                                <tr key={batch.id} className="bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">{batch.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{batch.herb}</td>
                                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">Marketplace Listing: {batch.marketplaceStatus}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="px-2 inline-flex text-xs leading-5 rounded-full bg-indigo-100 text-indigo-800">
                                            Live
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <span className="text-gray-400 text-xs">Listed {batch.listedDate}</span>
                                    </td>
                                </tr>
                            ))}
                            {readyForMarket.length === 0 && liveBatches.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 italic">No batches ready for final marketplace approval.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };


    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-900 border-b pb-3">AyurSaathi Central Admin Panel</h1>
                </header>

                <div className="space-y-8 pb-10">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'user' && <UserManagement />}
                    {activeTab === 'farmerPayment' && <FarmerPaymentControl />}
                    {activeTab === 'laboratory' && <LabMarketplaceControl />}
                </div>
                <StatusDisplay />
            </div>
        </div>
    );
};

export default AdminPage;
