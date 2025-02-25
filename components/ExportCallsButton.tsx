"use client"

import { useState } from "react"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { useCallHistoryStore } from "@/store/useCallHistoryStore"
import { convertToCSV, downloadCSV } from "@/utils/csvExport"

export default function ExportCallsButton() {
  const { calls, clearCalls } = useCallHistoryStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const handleExport = () => {
    if (calls.length === 0) {
      alert("No call data to export.");
      return;
    }
    
    const csvData = convertToCSV(calls);
    const filename = `southern-smiles-calls-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvData, filename);
  };
  
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
          disabled={calls.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Export Calls ({calls.length})</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => calls.length > 0 && setIsConfirmOpen(true)}
          disabled={calls.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All Data</span>
        </Button>
      </div>
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Call History</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all call history data? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearCalls();
                setIsConfirmOpen(false);
              }}
            >
              Yes, Delete All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}