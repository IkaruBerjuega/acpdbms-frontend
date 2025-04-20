import { Button } from '../../button';
import { MdAdd } from 'react-icons/md';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../card';

export function ContactSection({
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
