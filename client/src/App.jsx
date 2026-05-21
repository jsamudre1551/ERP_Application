import { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('reports');
  const [role, setRole] = useState('Admin'); 
  
  const [inventory, setInventory] = useState([]);
  const [ordersReport, setOrdersReport] = useState([]);
  const [purchasesReport, setPurchasesReport] = useState([]);
  const [productionReport, setProductionReport] = useState([]);
  
  const [order, setOrder] = useState({ item_id: '', quantity: '' });
  const [po, setPo] = useState({ item_id: '', quantity: '' });
  const [inward, setInward] = useState({ po_id: '', item_id: '', quantity: '' });
  const [production, setProduction] = useState({ raw_id: '', finished_id: '', raw_qty: '', finished_qty: '' });
  const [outward, setOutward] = useState({ order_id: '', item_id: '', quantity: '' });

  const fetchInventory = async () => {
    const res = await fetch('http://localhost:5000/api/reports/inventory');
    const data = await res.json();
    setInventory(data);
  };

  const fetchReports = async () => {
    try {
      const ordersRes = await fetch('http://localhost:5000/api/reports/orders');
      setOrdersReport(await ordersRes.json());

      const prodRes = await fetch('http://localhost:5000/api/reports/production');
      setProductionReport(await prodRes.json());

      const purchasesRes = await fetch('http://localhost:5000/api/reports/purchases');
      setPurchasesReport(await purchasesRes.json());
    } catch (err) {
      console.error("Dashboard hydration failed:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchReports();
  }, []);

  const handleAction = async (endpoint, payload) => {
    const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (res.ok) {
      alert('Action Successful!');
      fetchInventory();
      fetchReports();
    } else {
      alert('Action Failed. Check console for database constraints.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Manufacturing ERP System</h1>
      
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-4 bg-gray-200 p-3 rounded w-fit">
          <span className="font-bold text-gray-700">Current Role:</span>
          <select 
            className="p-1 border rounded" 
            value={role} 
            onChange={(e) => {
              setRole(e.target.value);
              setActiveTab('inventory'); 
            }}
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Sales">Sales Team</option>
            <option value="Production">Production Team</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4">
          {role === 'Admin' && <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Reports Dashboard</button>}
          
          {(role === 'Admin' || role === 'Sales' || role === 'Production') && <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Inventory List</button>}
          
          {(role === 'Admin' || role === 'Sales') && <button onClick={() => setActiveTab('order')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'order' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Order Module</button>}
          
          {(role === 'Admin' || role === 'Production') && <button onClick={() => setActiveTab('purchase')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'purchase' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Purchase Module</button>}
          
          {(role === 'Admin' || role === 'Production') && <button onClick={() => setActiveTab('inward')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'inward' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Inward Module</button>}
          
          {(role === 'Admin' || role === 'Production') && <button onClick={() => setActiveTab('production')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'production' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Production Module</button>}
          
          {(role === 'Admin' || role === 'Sales') && <button onClick={() => setActiveTab('outward')} className={`px-4 py-2 font-semibold rounded ${activeTab === 'outward' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'}`}>Outward Module</button>}
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Inventory Report</h2>
              <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border">ID</th>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Stock Level</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td className="p-3 border">{item.id}</td>
                      <td className="p-3 border">{item.name}</td>
                      <td className="p-3 border font-bold text-blue-600">{item.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Customer Orders</h2>
                <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border">Order ID</th>
                      <th className="p-3 border">Item</th>
                      <th className="p-3 border">Qty</th>
                      <th className="p-3 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersReport.map(order => (
                      <tr key={order.id}>
                        <td className="p-3 border">{order.id}</td>
                        <td className="p-3 border">{order.name}</td>
                        <td className="p-3 border">{order.quantity}</td>
                        <td className={`p-3 border font-semibold ${order.status === 'Shipped' ? 'text-green-600' : 'text-orange-500'}`}>
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Purchase Orders (Inbound)</h2>
                <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border">PO ID</th>
                      <th className="p-3 border">Material</th>
                      <th className="p-3 border">Qty</th>
                      <th className="p-3 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasesReport.map(po => (
                      <tr key={po.id}>
                        <td className="p-3 border">{po.id}</td>
                        <td className="p-3 border">{po.name}</td>
                        <td className="p-3 border">{po.quantity}</td>
                        <td className={`p-3 border font-semibold ${po.status === 'Inwarded' ? 'text-green-600' : 'text-orange-500'}`}>
                          {po.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Production History</h2>
                <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border">Log ID</th>
                      <th className="p-3 border">Raw Material Used</th>
                      <th className="p-3 border">Finished Good Created</th>
                      <th className="p-3 border">Qty Produced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productionReport.map(log => (
                      <tr key={log.id}>
                        <td className="p-3 border">{log.id}</td>
                        <td className="p-3 border text-orange-600">{log.raw_material}</td>
                        <td className="p-3 border text-green-600">{log.finished_good}</td>
                        <td className="p-3 border font-bold">{log.quantity_produced}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
           <div>
             <h2 className="text-2xl font-semibold mb-4">Current Inventory</h2>
             <table className="w-full max-w-lg text-left border-collapse bg-white shadow-sm rounded">
               <thead>
                 <tr className="bg-gray-200">
                   <th className="p-3 border">ID</th>
                   <th className="p-3 border">Name</th>
                   <th className="p-3 border">Stock Level</th>
                 </tr>
               </thead>
               <tbody>
                 {inventory.map(item => (
                   <tr key={item.id}>
                     <td className="p-3 border">{item.id}</td>
                     <td className="p-3 border">{item.name}</td>
                     <td className="p-3 border font-bold text-blue-600">{item.stock}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {(role === 'Admin' || role === 'Sales') && activeTab === 'order' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-2xl font-semibold">Take Customer Order</h2>
            <select className="border p-2 rounded bg-white" value={order.item_id} onChange={e => setOrder({...order, item_id: e.target.value})}>
              <option value="">-- Select Finished Good --</option>
              {inventory.filter(item => item.type === 'FINISHED_GOOD').map(item => (
                <option key={item.id} value={item.id}>{item.name} (In Stock: {item.stock})</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Quantity" className="border p-2 rounded" value={order.quantity} onChange={e => setOrder({...order, quantity: e.target.value})} />
            <button onClick={() => handleAction('orders', order)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors">Place Order</button>
          </div>
        )}

        {(role === 'Admin' || role === 'Production') && activeTab === 'purchase' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-2xl font-semibold">Create Purchase Order</h2>
            <select className="border p-2 rounded bg-white" value={po.item_id} onChange={e => setPo({...po, item_id: e.target.value})}>
              <option value="">-- Select Raw Material to Buy --</option>
              {inventory.filter(item => item.type === 'RAW_MATERIAL').map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Quantity" className="border p-2 rounded" value={po.quantity} onChange={e => setPo({...po, quantity: e.target.value})} />
            <button onClick={() => handleAction('purchase-orders', po)} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors">Create PO</button>
          </div>
        )}

        {(role === 'Admin' || role === 'Production') && activeTab === 'inward' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-2xl font-semibold">Inward Materials</h2>
            <input type="number" min="1" placeholder="Purchase Order ID (e.g., 1)" className="border p-2 rounded" value={inward.po_id} onChange={e => setInward({...inward, po_id: e.target.value})} />
            <select className="border p-2 rounded bg-white" value={inward.item_id} onChange={e => setInward({...inward, item_id: e.target.value})}>
              <option value="">-- Verify Raw Material Received --</option>
              {inventory.filter(item => item.type === 'RAW_MATERIAL').map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Quantity Received" className="border p-2 rounded" value={inward.quantity} onChange={e => setInward({...inward, quantity: e.target.value})} />
            <button onClick={() => handleAction('inward', inward)} className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded font-bold transition-colors">Receive & Update Inventory</button>
          </div>
        )}

        {(role === 'Admin' || role === 'Production') && activeTab === 'production' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-2xl font-semibold">Production Module</h2>
            <select className="border p-2 rounded bg-white" value={production.raw_id} onChange={e => setProduction({...production, raw_id: e.target.value})}>
              <option value="">-- Raw Material Used --</option>
              {inventory.filter(item => item.type === 'RAW_MATERIAL').map(item => (
                <option key={item.id} value={item.id}>{item.name} (Avail: {item.stock})</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Raw Material Qty Used" className="border p-2 rounded" value={production.raw_qty} onChange={e => setProduction({...production, raw_qty: e.target.value})} />
            <select className="border p-2 rounded bg-white" value={production.finished_id} onChange={e => setProduction({...production, finished_id: e.target.value})}>
              <option value="">-- Finished Good Created --</option>
              {inventory.filter(item => item.type === 'FINISHED_GOOD').map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Finished Good Qty Produced" className="border p-2 rounded" value={production.finished_qty} onChange={e => setProduction({...production, finished_qty: e.target.value})} />
            <button onClick={() => handleAction('production', production)} className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded transition-colors">Process Production</button>
          </div>
        )}

        {(role === 'Admin' || role === 'Sales') && activeTab === 'outward' && (
          <div className="flex flex-col gap-4 max-w-sm">
            <h2 className="text-2xl font-semibold">Sale / Outward Module</h2>
            <input type="number" min="1" placeholder="Customer Order ID" className="border p-2 rounded" value={outward.order_id} onChange={e => setOutward({...outward, order_id: e.target.value})} />
            <select className="border p-2 rounded bg-white" value={outward.item_id} onChange={e => setOutward({...outward, item_id: e.target.value})}>
              <option value="">-- Select Finished Good to Ship --</option>
              {inventory.filter(item => item.type === 'FINISHED_GOOD').map(item => (
                <option key={item.id} value={item.id}>{item.name} (In Stock: {item.stock})</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Quantity to Dispatch" className="border p-2 rounded" value={outward.quantity} onChange={e => setOutward({...outward, quantity: e.target.value})} />
            <button onClick={() => handleAction('outward', outward)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded font-bold transition-colors">Ship Goods & Reduce Inventory</button>
          </div>
        )}
      </div> 
    </div> 
  );
}

export default App;