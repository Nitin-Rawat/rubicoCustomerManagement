import { useState, useEffect } from 'react';
import { CustomerList } from './components/CustomerList';
import { AddCustomer } from './components/AddCustomer';
import { Toast } from './components/ui/Toast';
import { Modal } from './components/ui/Modal';
import { Customer } from './lib/types';
import { CustomerFormData } from './lib/validation/customerSchema';
import { customerRepository } from './services';

type Screen = 'list' | 'add' | 'edit';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [screen, setScreen] = useState<Screen>('list');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; customerId: string | null }>({
    isOpen: false,
    customerId: null,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerRepository.getAll();
      setCustomers(data);
    } catch (error) {
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddCustomer = async (data: CustomerFormData) => {
    const payload = {
      fullName: data.fullName,
      email: data.email || undefined,
      phone: data.phone || undefined,
      billingAddress: data.billingAddress,
      shippingSameAsBilling: data.shippingSameAsBilling,
      shippingAddress: data.shippingAddress || undefined,
    };

    try {
      if (editingCustomer) {
        await customerRepository.update(editingCustomer.id, payload);
        showToast('Customer updated successfully!', 'success');
      } else {
        await customerRepository.create(payload);
        showToast('Customer added successfully!', 'success');
      }
      await loadCustomers();
      setScreen('list');
      setEditingCustomer(null);
    } catch (error) {
      showToast(editingCustomer ? 'Failed to update customer' : 'Failed to add customer', 'error');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setScreen('edit');
  };

  const handleDeleteClick = (customerId: string) => {
    setDeleteModal({ isOpen: true, customerId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.customerId) return;

    try {
      await customerRepository.delete(deleteModal.customerId);
      showToast('Customer deleted successfully!', 'success');
      await loadCustomers();
    } catch (error) {
      showToast('Failed to delete customer', 'error');
    } finally {
      setDeleteModal({ isOpen: false, customerId: null });
    }
  };

  const handleCancel = () => {
    setScreen('list');
    setEditingCustomer(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E6F7F9] via-[#F9FAFB] to-[#E6F7F9] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#00B1BE] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {screen === 'list' && (
        <CustomerList
          customers={customers}
          onAddNew={() => setScreen('add')}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteClick}
        />
      )}

      {(screen === 'add' || screen === 'edit') && (
        <AddCustomer
          onSubmit={handleAddCustomer}
          onCancel={handleCancel}
          initialData={
            editingCustomer
              ? {
                fullName: editingCustomer.fullName,
                email: editingCustomer.email || '',
                phone: editingCustomer.phone || '',
                billingAddress: editingCustomer.billingAddress,
                shippingSameAsBilling: editingCustomer.shippingSameAsBilling,
                shippingAddress: editingCustomer.shippingAddress || '',
              }
              : undefined
          }
          isEditing={screen === 'edit'}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, customerId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        confirmText="Delete"
        confirmVariant="danger"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this customer? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}

export default App;