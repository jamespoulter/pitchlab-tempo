'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

export default function StripeRedirectHandler() {
  const searchParams = useSearchParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check for Stripe redirect parameters
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (sessionId && success === 'true') {
      // Handle successful payment
      setAlertType('success');
      setMessage('Your payment was successful! Your subscription is now active.');
      setShowAlert(true);
      
      // Hide the alert after 10 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    } else if (canceled === 'true') {
      // Handle canceled payment
      setAlertType('error');
      setMessage('Your payment was canceled. If you need help, please contact support.');
      setShowAlert(true);
      
      // Hide the alert after 10 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!showAlert) return null;

  return (
    <Alert 
      className={`mb-6 ${alertType === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
    >
      <div className="flex items-start">
        {alertType === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        )}
        <div>
          <AlertTitle className={alertType === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alertType === 'success' ? 'Payment Successful' : 'Payment Canceled'}
          </AlertTitle>
          <AlertDescription className={alertType === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
} 