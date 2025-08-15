'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

interface SmartContract {
  id: string;
  type: 'escrow' | 'reputation' | 'dispute' | 'payment';
  status: 'pending' | 'active' | 'completed' | 'disputed';
  amount: number;
  parties: string[];
  createdAt: string;
  completedAt?: string;
  terms: string[];
}

interface BlockchainProps {
  contracts?: SmartContract[];
  onCreateContract?: (type: string, terms: any) => void;
  className?: string;
}

export function SmartContractsManager({ 
  contracts = [], 
  onCreateContract,
  className = '' 
}: BlockchainProps) {
  const [activeContracts, setActiveContracts] = useState<SmartContract[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [gasPrice, setGasPrice] = useState(0);

  useEffect(() => {
    // Simulate blockchain connection
    setActiveContracts(contracts);
    setGasPrice(Math.random() * 50 + 20); // Simulate gas price
  }, [contracts]);

  const createEscrowContract = async (amount: number, terms: string[]) => {
    setIsDeploying(true);
    
    // Simulate smart contract deployment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newContract: SmartContract = {
      id: `contract_${Date.now()}`,
      type: 'escrow',
      status: 'active',
      amount,
      parties: ['provider', 'customer'],
      createdAt: new Date().toISOString(),
      terms
    };

    setActiveContracts(prev => [...prev, newContract]);
    setIsDeploying(false);
    
    if (onCreateContract) {
      onCreateContract('escrow', { amount, terms });
    }
  };

  const getContractIcon = (type: string) => {
    switch (type) {
      case 'escrow': return <Lock className="w-5 h-5" />;
      case 'reputation': return <Shield className="w-5 h-5" />;
      case 'dispute': return <AlertTriangle className="w-5 h-5" />;
      case 'payment': return <DollarSign className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Smart Contracts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Blockchain-secured service agreements
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Network: Ethereum
        </Badge>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gas Price</p>
                <p className="text-lg font-bold">{gasPrice.toFixed(1)} gwei</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Contracts</p>
                <p className="text-lg font-bold">{activeContracts.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-lg font-bold">
                  ${activeContracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
                <p className="text-lg font-bold">2.3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deploy New Contract */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Deploy Smart Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => createEscrowContract(500, ['Complete service', 'Customer approval required'])}
              disabled={isDeploying}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Escrow Contract
            </Button>
            
            <Button 
              onClick={() => createEscrowContract(100, ['Reputation update', 'Automatic execution'])}
              disabled={isDeploying}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Reputation Contract
            </Button>
            
            <Button 
              onClick={() => createEscrowContract(1000, ['Dispute resolution', 'Multi-party arbitration'])}
              disabled={isDeploying}
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Dispute Contract
            </Button>
          </div>

          {isDeploying && (
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Deploying contract to blockchain...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg text-white ${getStatusColor(contract.status)}`}>
                    {getContractIcon(contract.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize">{contract.type} Contract</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contract.parties.join(' ↔ ')} • ${contract.amount}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="capitalize">
                    {contract.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(contract.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            {activeContracts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No active contracts. Deploy your first smart contract to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SmartContractsManager;
