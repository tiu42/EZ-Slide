import React from 'react'
import Button from '../components/ui/Button'
import InputField from '../components/ui/InputField'
import Card from '../components/ui/Card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Test = () => {
    return (
        <div>
            <div className='buttons'>
                <Button size='lg'>size='lg'</Button>
                <Button>varient = primary, size='md'</Button>
                <Button size='sm'>size='sm'</Button>
                <Button variant='secondary'>variant='secondary'</Button>
                <Button variant='outline'>variant='outline'</Button>
                <Button variant='danger'>variant='danger'</Button>
                <Button variant='ghost'>variant='ghost'</Button>
            </div>
            <div className='input_field'>
                <InputField label={'This is an input field'}/>
                <InputField 
                    label={'This is an input field with error'}
                    error={'This is the error'}
                />
                <InputField 
                    label={'This is an input field with icon'}
                    icon={AlertCircle}
                />
            </div>
            <div>
                <Card>This is a card</Card>
                <Card interactive={true}>This is an interactive card</Card>
            </div>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
            <Link to='/dashboard'>Dashboard</Link>
            <Link to='/slides'>Slides</Link>
        </div>
    )
}

export default Test