import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { getUsersByRole, getPendingUsers, approveUser, deleteUser } from '@/data/userData';
import { User } from '@/data/userData';
import { UserCheck, UserX, UserPlus, Trash2, Edit, Plus } from 'lucide-react';
import { menuItems, MenuItem, getMenuItems } from '@/data/menuData';

const SuperAdminTab = () => {
  const [pendingCashiers, setPendingCashiers] = useState<User[]>([]);
  const [approvedCashiers, setApprovedCashiers] = useState<User[]>([]);
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('coffee');
  const [productImage, setProductImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCashiers();
    fetchProducts();
  }, []);

  const fetchCashiers = async () => {
    try {
      const pending = await getPendingUsers();
      setPendingCashiers(pending.filter(user => user.role === 'cashier'));
      
      const approved = await getUsersByRole('cashier');
      setApprovedCashiers(approved.filter(user => user.status === 'approved'));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cashier data",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const items = await getMenuItems();
      setProducts(items);
    } catch (error) {
      // Fallback to local data if API fails
      setProducts(menuItems);
      console.error('Error fetching menu items:', error);
    }
  };

  const handleApproveCashier = async (userId: number) => {
    try {
      await approveUser(userId);
      toast({
        title: "Success",
        description: "Cashier has been approved",
      });
      fetchCashiers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve cashier",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCashier = async (userId: number) => {
    try {
      await deleteUser(userId);
      toast({
        title: "Success",
        description: "Cashier has been deleted",
      });
      fetchCashiers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cashier",
        variant: "destructive",
      });
    }
  };

  const openAddProductDialog = () => {
    setSelectedProduct(null);
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductCategory('coffee');
    setProductImage('');
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product: MenuItem) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductImage(product.image);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        if (selectedProduct) {
          // Edit existing product
          const updatedProducts = products.map(p => 
            p.id === selectedProduct.id 
              ? {
                  ...p,
                  name: productName,
                  description: productDescription,
                  price: parseFloat(productPrice),
                  category: productCategory as MenuItem['category'],
                  image: productImage
                } 
              : p
          );
          setProducts(updatedProducts);
          toast({
            title: "Success",
            description: "Product updated successfully",
          });
        } else {
          // Add new product
          const newProduct: MenuItem = {
            id: Math.max(...products.map(p => p.id)) + 1,
            name: productName,
            description: productDescription,
            price: parseFloat(productPrice),
            category: productCategory as MenuItem['category'],
            image: productImage || 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5'
          };
          setProducts([...products, newProduct]);
          toast({
            title: "Success",
            description: "Product added successfully",
          });
        }
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save product",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleDeleteProduct = (productId: number) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Super Admin Control Panel</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Cashier Management</CardTitle>
          <CardDescription>
            Approve or reject cashier registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium mb-2">Pending Cashiers</h3>
          {pendingCashiers.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCashiers.map((cashier) => (
                    <TableRow key={cashier.id}>
                      <TableCell>{cashier.name}</TableCell>
                      <TableCell>{cashier.email}</TableCell>
                      <TableCell>{new Date(cashier.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleApproveCashier(cashier.id)}
                            className="flex items-center gap-1"
                          >
                            <UserCheck className="h-4 w-4" />
                            <span>Approve</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDeleteCashier(cashier.id)}
                            className="flex items-center gap-1"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No pending cashier registrations.</p>
          )}

          <h3 className="font-medium mt-6 mb-2">Approved Cashiers</h3>
          {approvedCashiers.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedCashiers.map((cashier) => (
                    <TableRow key={cashier.id}>
                      <TableCell>{cashier.name}</TableCell>
                      <TableCell>{cashier.email}</TableCell>
                      <TableCell>{new Date(cashier.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteCashier(cashier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">No approved cashiers.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              Add, edit, or delete products
            </CardDescription>
          </div>
          <Button onClick={openAddProductDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => openEditProductDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Product Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? 'Update the product details below.' 
                : 'Fill in the details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Espresso"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="A strong coffee..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="3.50"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="pastry">Pastry</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminTab;
