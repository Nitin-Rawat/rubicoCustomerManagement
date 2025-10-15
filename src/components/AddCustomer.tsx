import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, MapPin, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { customerSchema, CustomerFormData } from '../lib/validation/customerSchema';
import { customerRepository } from '../services';

customerRepository.getAll();

interface AddCustomerProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  initialData?: CustomerFormData;
  isEditing?: boolean;
}

const STEPS = [
  { id: 1, title: "Personal Information", icon: User },
  { id: 2, title: "Address Information", icon: MapPin },
  { id: 3, title: "Review & Confirm", icon: CheckCircle },
];

export const AddCustomer = ({ onSubmit, onCancel, initialData, isEditing = false }: AddCustomerProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      fullName: '',
      email: '',
      phone: '',
      billingAddress: '',
      shippingSameAsBilling: true,
      shippingAddress: '',
    },
    mode: "onChange",
  });

  const { register, handleSubmit: formHandleSubmit, watch, trigger, formState: { errors } } = form;
  const formData = watch();

  // Async email validation
  const validateEmailUnique = async (email: string | undefined) => {
    if (!email || isEditing) return true;
    const exists = await customerRepository.emailExists(email);
    return !exists || "Email already exists";
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CustomerFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['billingAddress', 'shippingSameAsBilling', 'shippingAddress'];
    }

    const isValid = await trigger(fieldsToValidate);
    console.log('Is valid:', isValid);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } 
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onFormSubmit = (data: CustomerFormData) => {
    onSubmit(data);
  };

  const editStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F7F9] via-[#F9FAFB] to-[#E6F7F9] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update customer information' : 'Create a new customer profile'}
          </p>
          <div className="flex items-center justify-between mb-8 mt-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-[#00B1BE] text-white'
                        : isActive
                          ? 'bg-gradient-to-r from-[#00B1BE] to-[#0094C6] text-white shadow-lg scale-110'
                          : 'bg-white text-gray-400 border-2 border-gray-300'
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-[#00B1BE]' : 'text-gray-500'
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 mb-6 transition-all duration-300 ${currentStep > step.id ? 'bg-[#00B1BE]' : 'bg-gray-300'
                        }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={formHandleSubmit(onFormSubmit)}>
          <Card className="p-8 animate-fade-in">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600 mt-1">Enter the customer's basic details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      {...register('fullName')}
                      error={errors.fullName?.message}
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email', {
                      required: "Email or phone is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email"
                      },
                      validate: validateEmailUnique
                    })}
                    error={errors.email?.message}
                    helperText={!errors.email && !errors.phone ? 'Either email or phone is required' : undefined}
                  />

                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Address Information</h2>
                  <p className="text-gray-600 mt-1">Provide billing and shipping addresses</p>
                </div>

                <Textarea
                  label="Billing Address"
                  placeholder="123 Main St, Apt 4B&#10;New York, NY 10001"
                  {...register('billingAddress')}
                  error={errors.billingAddress?.message}
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAsBilling"
                    {...register('shippingSameAsBilling')}
                    className="w-4 h-4 text-[#00B1BE] border-gray-300 rounded focus:ring-[#00B1BE]"
                  />
                  <label htmlFor="sameAsBilling" className="text-sm font-medium text-gray-700">
                    Shipping address same as billing
                  </label>
                </div>

                {!formData.shippingSameAsBilling && (
                  <Textarea
                    label="Shipping Address"
                    placeholder="456 Oak Ave&#10;Brooklyn, NY 11201"
                    {...register('shippingAddress')}
                    error={errors.shippingAddress?.message}
                  />
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Review & Confirm</h2>
                  <p className="text-gray-600 mt-1">Please review the information before submitting</p>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <User size={18} className="text-[#00B1BE]" />
                        Personal Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => editStep(1)}
                        className="text-[#00B1BE] hover:text-[#0094C6] text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-600 w-24">Name:</span>
                        <span className="text-gray-900 font-medium">{formData.fullName}</span>
                      </div>
                      {formData.email && (
                        <div className="flex">
                          <span className="text-gray-600 w-24">Email:</span>
                          <span className="text-gray-900">{formData.email}</span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex">
                          <span className="text-gray-600 w-24">Phone:</span>
                          <span className="text-gray-900">{formData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin size={18} className="text-[#00B1BE]" />
                        Address Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => editStep(2)}
                        className="text-[#00B1BE] hover:text-[#0094C6] text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600 block mb-1">Billing Address:</span>
                        <p className="text-gray-900 whitespace-pre-line">{formData.billingAddress}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Shipping Address:</span>
                        <p className="text-gray-900 whitespace-pre-line">
                          {formData.shippingSameAsBilling
                            ? 'Same as billing address'
                            : formData.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? onCancel : handleBack}
                className="gap-2"
              >
                <ChevronLeft size={18} />
                {currentStep === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="gap-2">
                  Next
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};