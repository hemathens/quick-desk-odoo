import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tags, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Hash,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockCategories = [
  {
    id: '1',
    name: 'React',
    description: 'Questions related to React.js framework',
    color: '#61DAFB',
    questionsCount: 1250,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'JavaScript',
    description: 'General JavaScript programming questions',
    color: '#F7DF1E',
    questionsCount: 2100,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'TypeScript',
    description: 'TypeScript language and tooling questions',
    color: '#3178C6',
    questionsCount: 890,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'CSS',
    description: 'Styling and CSS related questions',
    color: '#1572B6',
    questionsCount: 567,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '5',
    name: 'Node.js',
    description: 'Backend development with Node.js',
    color: '#339933',
    questionsCount: 423,
    isActive: false,
    createdAt: '2024-01-01'
  }
];

export default function CategoriesManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    let filtered = categories;
    
    if (searchQuery) {
      filtered = filtered.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(category => category.isActive === isActive);
    }
    
    setFilteredCategories(filtered);
  }, [categories, searchQuery, statusFilter]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      toast({
        title: "Category updated",
        description: "Category has been successfully updated.",
      });
    } else {
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
        questionsCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: "Category created",
        description: "New category has been successfully created.",
      });
    }

    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast({
      title: "Category deleted",
      description: "Category has been successfully deleted.",
    });
  };

  const handleStatusToggle = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ));
    toast({
      title: "Status updated",
      description: "Category status has been updated.",
    });
  };

  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
    setIsDialogOpen(true);
  };

  return (
    <Card className="card-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Tags className="w-5 h-5 mr-2 text-primary" />
              Categories Management
            </CardTitle>
            <CardDescription>
              Manage question categories and organize content.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? 'Update the category information below.'
                    : 'Fill in the details for the new category.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., React, JavaScript, CSS"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of this category"
                    className="resize-none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="color">Category Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 p-1 rounded border"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingCategory ? 'Update' : 'Create'} Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-elegant"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Hash className="w-3 h-3 mr-1" />
                          ID: {category.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm max-w-xs truncate">{category.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-muted-foreground" />
                      {category.questionsCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusToggle(category.id)}
                    >
                      <Badge 
                        className={category.isActive 
                          ? 'bg-success/20 text-success hover:bg-success/30' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <Tags className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or create a new category.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}