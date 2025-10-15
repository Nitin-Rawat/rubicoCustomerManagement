import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Customer } from '../lib/types';


interface CustomerListProps {
  customers: Customer[];
  onAddNew: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

type SortOption = 'name-asc' | 'name-desc' | 'recent' | 'oldest';

export const CustomerList = ({ customers, onAddNew, onEdit, onDelete }: CustomerListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) =>
      customer.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName);
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });


    return filtered;
  }, [customers, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F7F9] via-[#F9FAFB] to-[#E6F7F9]">
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00B1BE] to-[#0094C6] bg-clip-text text-transparent">
              Customer Management
            </h1>
            <Button onClick={onAddNew} className="gap-2 hidden sm:flex">
              <Plus size={20} />
              Add New Customer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B1BE] focus:border-transparent transition-all duration-200"
              >
                <option value="recent">Recently Added</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>

          {filteredAndSortedCustomers.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {paginatedCustomers.length} of {filteredAndSortedCustomers.length} customer
              {filteredAndSortedCustomers.length !== 1 ? 's' : ''}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          {paginatedCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Get started by adding your first customer'}
              </p>
              {!searchQuery && (
                <Button onClick={onAddNew} className="gap-2">
                  <Plus size={20} />
                  Add New Customer
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Billing Address
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-[#E6F7F9]/30 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{customer.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-700">{customer.email || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-700">{customer.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-700 max-w-xs truncate">
                            {customer.billingAddress}
                      ˀ    </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => onEdit(customer)}
                              className="p-2 text-[#00B1BE] hover:bg-[#E6F7F9] rounded-lg transition-colors duration-150"
                              title="Edit customer"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => onDelete(customer.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                              title="Delete customer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      <button
        onClick={onAddNew}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#00B1BE] to-[#0094C6] text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-200 z-40"
        title="Add new customer"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};
