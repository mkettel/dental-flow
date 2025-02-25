// utils/csvExport.ts
import { CallRecord } from "@/store/useCallHistoryStore";

/**
 * Convert an array of call records to CSV format
 */
export const convertToCSV = (calls: CallRecord[]): string => {
  if (calls.length === 0) return '';

  // Define the headers we want in our CSV
  const headers = [
    'Call Date',
    'Handler Name',
    'Patient Name',
    'Phone Number',
    'Referral Source',
    'Reason for Visit',
    'Insurance Type',
    'Appointment Type',
    'Date of Birth',
    'Email',
    'Address'
  ];

  // Create the header row
  const csvRows = [headers.join(',')];

  // Add data rows
  for (const call of calls) {
    const values = [
      formatDate(call.callDate),
      escapeCsvValue(call.handlerName || ''),
      escapeCsvValue(call.name),
      escapeCsvValue(call.phoneNumber),
      escapeCsvValue(call.referralSource || ''),
      escapeCsvValue(call.visitReason || ''),
      escapeCsvValue(call.insuranceType || ''),
      escapeCsvValue(call.appointmentType || ''),
      call.dateOfBirth || '',
      escapeCsvValue(call.email || ''),
      escapeCsvValue(call.address || '')
    ];
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

/**
 * Format date for CSV export
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Escape values for CSV to handle commas, quotes, etc.
 */
const escapeCsvValue = (value: string): string => {
  if (!value) return '';
  
  // If the value contains commas, quotes, or newlines, wrap it in quotes
  const needsQuotes = /[",\n\r]/.test(value);
  
  if (needsQuotes) {
    // Double any existing quotes
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
};

/**
 * Download CSV data as a file
 */
export const downloadCSV = (csvData: string, filename: string = 'patient-calls.csv'): void => {
  // Create a blob with the CSV data
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set the link's properties
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add the link to the DOM, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};