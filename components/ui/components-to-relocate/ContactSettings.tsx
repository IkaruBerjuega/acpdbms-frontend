'use client';

import { useState, useEffect } from 'react';
import {
  useForm,
  useFieldArray,
  type SubmitHandler,
  FormProvider,
} from 'react-hook-form';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import { FaFacebookF, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdAdd } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  useAdminSettings,
  useSettingsActions,
} from '@/hooks/general/use-admin-settings';
import type { DynamicContactSchema } from '@/lib/definitions';

// ContactSection and ConfirmDialog components remain unchanged
function ContactSection({
  title,
  children,
  onEdit,
  onAdd,
  isEditing,
  isEmpty,
  description,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
  onAdd?: () => void;
  isEditing: boolean;
  isEmpty?: boolean;
  description?: string;
}) {
  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-lg'>{title}</CardTitle>
          </div>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant={isEditing ? 'outline' : 'default'}
              size='sm'
              onClick={onEdit}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {isEditing && onAdd && (
              <Button type='button' variant='default' size='sm' onClick={onAdd}>
                <MdAdd className='mr-1' /> Add
              </Button>
            )}
          </div>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isEmpty && !isEditing ? (
          <p className='text-sm text-muted-foreground'>
            No {title.toLowerCase()} available.
          </p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function ConfirmDialog({
  title,
  description,
  onConfirm,
  disabled = false,
}: {
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ContactSettings({
  handleStoreContactDetails,
  contactNumbers,
}: {
  handleStoreContactDetails: (
    contactDetails: { type: string; value: string }[],
    values?: string[]
  ) => Promise<any>;
  contactNumbers: { id?: number; type: string; value: string }[];
}) {
  const methods = useForm<DynamicContactSchema>({
    mode: 'onBlur',
    defaultValues: { contact_details: [] },
  });

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [removedValues, setRemovedValues] = useState<string[]>([]);

  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact_details',
  });

  useEffect(() => {
    if (!toggleEdit && contactNumbers?.length) {
      const formattedContactDetails = contactNumbers.map((contact) => ({
        id: Number(contact.id) || undefined,
        type: contact.type || 'contact_number',
        value: contact.value || '',
      }));
      reset({ contact_details: formattedContactDetails });
    }
  }, [contactNumbers, reset, toggleEdit]);

  const handleRemoveContact = (index: number, value: string) => {
    setRemovedValues((prevValues) => [...prevValues, value]);
    remove(index);
  };

  const processForm: SubmitHandler<DynamicContactSchema> = async (data) => {
    const formattedContactDetails = data.contact_details.map((contact) => ({
      type: contact.type || 'contact_number',
      value: contact.value || '',
    }));

    const isSuccessful = await handleStoreContactDetails(
      formattedContactDetails,
      removedValues
    );

    if (isSuccessful) {
      toast({
        description:
          isSuccessful.message || 'Contact numbers updated successfully',
        title: 'Success',
      });
      setToggleEdit(false);
      setRemovedValues([]);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <ContactSection
          title='Contact Numbers'
          onEdit={() => {
            setToggleEdit((prev) => !prev);
            if (toggleEdit) setRemovedValues([]);
          }}
          onAdd={() => append({ type: 'contact_number', value: '' })}
          isEditing={toggleEdit}
          isEmpty={!contactNumbers?.length}
        >
          {!toggleEdit ? (
            <div className='space-y-2'>
              {contactNumbers?.map((contact, index) => (
                <div key={index} className='flex items-center gap-2 text-sm'>
                  <MdPhone className='h-4 w-4 text-muted-foreground' />
                  <span>{contact.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className='space-y-3'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2'>
                  <Input
                    placeholder='Enter contact number'
                    {...methods.register(`contact_details.${index}.value`)}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      handleRemoveContact(index, field.value || '')
                    }
                    className='h-9 w-9 text-destructive hover:text-destructive/90 hover:bg-destructive/10'
                  >
                    <IoMdRemoveCircleOutline className='h-5 w-5' />
                  </Button>
                </div>
              ))}
              {fields.length > 0 && (
                <CardFooter className='px-0 pt-4'>
                  <ConfirmDialog
                    title='Update Contact Numbers'
                    description='Do you confirm to update the list of contact numbers?'
                    onConfirm={handleSubmit(processForm)}
                    disabled={fields.length === 0}
                  />
                </CardFooter>
              )}
            </div>
          )}
        </ContactSection>
      </form>
    </FormProvider>
  );
}

export function EmailSettings({
  handleStoreContactDetails,
  email,
}: {
  handleStoreContactDetails: (
    contactDetails: { type: string; value: string }[],
    values?: string[]
  ) => Promise<any>;
  email: { id?: number; type: string; value: string }[];
}) {
  const methods = useForm<{ email: string }>({
    mode: 'onBlur',
    defaultValues: { email: '' },
  });

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!toggleEdit && email?.length) {
      reset({ email: email[0]?.value || '' });
    }
  }, [email, reset, toggleEdit]);

  const processForm: SubmitHandler<{ email: string }> = async (data) => {
    const formattedContactDetails = [{ type: 'email', value: data.email }];
    const isSuccessful = await handleStoreContactDetails(
      formattedContactDetails
    );

    if (isSuccessful) {
      toast({
        description: isSuccessful.message || 'Email updated successfully',
        title: 'Success',
      });
      setToggleEdit(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <ContactSection
          title='Email Address'
          onEdit={() => setToggleEdit((prev) => !prev)}
          isEditing={toggleEdit}
          isEmpty={!email?.length}
        >
          {!toggleEdit ? (
            <div className='flex items-center gap-2 text-sm'>
              <MdEmail className='h-4 w-4 text-muted-foreground' />
              <span>{watch('email') || 'No email set'}</span>
            </div>
          ) : (
            <>
              <div className='space-y-2'>
                <Input
                  placeholder='Enter email address'
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className='text-sm text-destructive'>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <CardFooter className='px-0 pt-4'>
                <ConfirmDialog
                  title='Update Email'
                  description='Do you confirm to update the email address?'
                  onConfirm={handleSubmit(processForm)}
                />
              </CardFooter>
            </>
          )}
        </ContactSection>
      </form>
    </FormProvider>
  );
}

export function SocialMedia({
  handleStoreContactDetails,
  facebook,
  instagram,
  linkedIn,
}: {
  handleStoreContactDetails: (
    contactDetails: { type: string; value: string }[],
    values?: string[]
  ) => Promise<any>;
  facebook: { id?: number; type: string; value: string }[];
  instagram: { id?: number; type: string; value: string }[];
  linkedIn: { id?: number; type: string; value: string }[];
}) {
  const methods = useForm<DynamicContactSchema>({
    mode: 'onBlur',
    defaultValues: { contact_details: [] },
  });

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [removedValues, setRemovedValues] = useState<string[]>([]);

  const { control, handleSubmit, reset } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contact_details',
  });

  useEffect(() => {
    if (!toggleEdit) {
      const allSocials = [
        ...facebook.map((contact) => ({ ...contact, type: 'facebook' })),
        ...instagram.map((contact) => ({ ...contact, type: 'instagram' })),
        ...linkedIn.map((contact) => ({ ...contact, type: 'linkedin' })),
      ];
      if (allSocials.length) {
        reset({ contact_details: allSocials });
      }
    }
  }, [facebook, instagram, linkedIn, reset, toggleEdit]);

  const handleRemoveSocial = (index: number, value: string) => {
    setRemovedValues((prevValues) => [...prevValues, value]);
    remove(index);
  };

  const processForm: SubmitHandler<DynamicContactSchema> = async (data) => {
    const formattedContactDetails = data.contact_details.map((contact) => ({
      type: contact.type || 'facebook',
      value: contact.value || '',
    }));
    const isSuccessful = await handleStoreContactDetails(
      formattedContactDetails,
      removedValues
    );

    if (isSuccessful) {
      toast({
        description:
          isSuccessful.message || 'Social media links updated successfully',
        title: 'Success',
      });
      setToggleEdit(false);
      setRemovedValues([]);
    }
  };

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'facebook':
        return <FaFacebookF className='h-4 w-4 text-[#1877F2]' />;
      case 'instagram':
        return <FaInstagram className='h-4 w-4 text-[#E4405F]' />;
      case 'linkedin':
        return <FaLinkedin className='h-4 w-4 text-[#0A66C2]' />;
      default:
        return null;
    }
  };

  const getSocialName = (type: string) => {
    switch (type) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'linkedin':
        return 'LinkedIn';
      default:
        return type;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(processForm)}>
        <ContactSection
          title='Social Media'
          onEdit={() => {
            setToggleEdit((prev) => !prev);
            if (toggleEdit) setRemovedValues([]);
          }}
          onAdd={() => append({ type: 'facebook', value: '' })}
          isEditing={toggleEdit}
          isEmpty={!facebook.length && !instagram.length && !linkedIn.length}
          description='Connect your social media accounts'
        >
          {!toggleEdit ? (
            <div className='space-y-2'>
              {[...facebook, ...instagram, ...linkedIn].map(
                (contact, index) => (
                  <div key={index} className='flex items-center gap-2 text-sm'>
                    {getSocialIcon(contact.type)}
                    <span>{contact.value}</span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className='space-y-3'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center gap-2'>
                  <Select
                    defaultValue={field.type}
                    onValueChange={(value) =>
                      methods.setValue(`contact_details.${index}.type`, value)
                    }
                  >
                    <SelectTrigger className='w-[130px]'>
                      <SelectValue placeholder='Select type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='facebook'>Facebook</SelectItem>
                        <SelectItem value='instagram'>Instagram</SelectItem>
                        <SelectItem value='linkedin'>LinkedIn</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={`Enter ${getSocialName(
                      field.type || 'social'
                    )} link`}
                    {...methods.register(`contact_details.${index}.value`)}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveSocial(index, field.value || '')}
                    className='h-9 w-9 text-destructive hover:text-destructive/90 hover:bg-destructive/10'
                  >
                    <IoMdRemoveCircleOutline className='h-5 w-5' />
                  </Button>
                </div>
              ))}
              {fields.length > 0 && (
                <CardFooter className='px-0 pt-4'>
                  <ConfirmDialog
                    title='Update Social Media Links'
                    description='Do you confirm to update the social media links?'
                    onConfirm={handleSubmit(processForm)}
                    disabled={fields.length === 0}
                  />
                </CardFooter>
              )}
            </div>
          )}
        </ContactSection>
      </form>
    </FormProvider>
  );
}

export function ContactSettingsPage() {
  const { contactDetailsQuery } = useAdminSettings<DynamicContactSchema>();
  const { storeContactDetails, deleteContactDetail } =
    useSettingsActions<any>();

  const {
    data: contactDetailsData,
    error: contactDetailsError,
    isLoading: isContactDetailsLoading,
  } = contactDetailsQuery;

  const { mutate: deleteContact } = deleteContactDetail;

  const contactDetails = contactDetailsData?.contact_details || [];

  const contactNumbers = contactDetails.filter(
    (contact) => contact.type === 'contact_number'
  );
  const email = contactDetails.filter((contact) => contact.type === 'email');
  const facebook = contactDetails.filter(
    (contact) => contact.type === 'facebook'
  );
  const instagram = contactDetails.filter(
    (contact) => contact.type === 'instagram'
  );
  const linkedIn = contactDetails.filter(
    (contact) => contact.type === 'linkedin'
  );

  const allContacts = contactNumbers.concat(facebook, instagram, linkedIn);

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact({ ids: [id] });
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error; // Re-throw to be caught by the caller
    }
  };

  const handleStoreContactDetailsBase = async (
    contactDetails: { type: string; value: string }[],
    removedValues?: string[],
    allContacts: { id?: number; type: string; value: string }[] = []
  ) => {
    // Handle deletions for removed values
    if (removedValues && removedValues.length > 0) {
      const contactsToDelete = allContacts.filter(
        (contact) => removedValues.includes(contact.value) && contact.id
      );

      try {
        await Promise.all(
          contactsToDelete.map((contact) =>
            handleDeleteContact(Number(contact.id))
          )
        );
        toast({
          title: 'Success',
          description: 'Removed contact details deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete contact details',
          variant: 'destructive',
        });
        return; // Stop if deletion fails
      }
    }

    // Proceed with storing/updating contact details
    try {
      const result = await storeContactDetails.mutate({
        contact_details: contactDetails,
        removed_values: removedValues,
      });
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contact details',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Wrapper function to pass allContacts
  const handleStoreContactDetails = async (
    contactDetails: { type: string; value: string }[],
    removedValues?: string[]
  ) => {
    return await handleStoreContactDetailsBase(
      contactDetails,
      removedValues,
      allContacts
    );
  };

  if (isContactDetailsLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  if (contactDetailsError) {
    return (
      <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive'>
        <p>Error loading contact settings: {String(contactDetailsError)}</p>
      </div>
    );
  }

  return (
    <div className='grid gap-6'>
      <ContactSettings
        handleStoreContactDetails={handleStoreContactDetails}
        contactNumbers={contactNumbers}
      />
      <EmailSettings
        handleStoreContactDetails={handleStoreContactDetails}
        email={email}
      />
      <SocialMedia
        handleStoreContactDetails={handleStoreContactDetails}
        facebook={facebook}
        instagram={instagram}
        linkedIn={linkedIn}
      />
    </div>
  );
}

export default ContactSettingsPage;
