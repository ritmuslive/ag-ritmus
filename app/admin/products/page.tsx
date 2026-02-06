"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getProducts,
  syncProductsFromDodo,
  createProduct,
  archiveProduct,
  unarchiveProduct,
  type LocalProduct,
  type ProductType,
} from "@/server/actions/products";
import {
  RefreshCw,
  Plus,
  Archive,
  ArchiveRestore,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, startSyncTransition] = useTransition();
  const [isCreating, startCreateTransition] = useTransition();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Create product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    type: "one_time" as ProductType,
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = () => {
    startSyncTransition(async () => {
      try {
        const result = await syncProductsFromDodo();
        toast.success(
          `Synced ${result.synced} products (${result.created} new, ${result.updated} updated)`,
        );
        await fetchProducts();
      } catch (error) {
        console.error("Error syncing products:", error);
        toast.error("Failed to sync products");
      }
    });
  };

  const handleCreate = () => {
    startCreateTransition(async () => {
      try {
        // Convert price from dollars to cents
        const priceInCents = Math.round(parseFloat(newProduct.price) * 100);

        await createProduct({
          name: newProduct.name,
          description: newProduct.description || undefined,
          price: priceInCents,
          type: newProduct.type,
          paymentFrequencyCount: 1,
          paymentFrequencyInterval: "month",
          subscriptionPeriodCount: 1,
          subscriptionPeriodInterval: "month",
        });

        toast.success("Product created successfully");
        setShowCreateDialog(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          type: "one_time",
        });
        await fetchProducts();
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("Failed to create product");
      }
    });
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveProduct(id);
      toast.success("Product archived");
      await fetchProducts();
    } catch (error) {
      console.error("Error archiving product:", error);
      toast.error("Failed to archive product");
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      await unarchiveProduct(id);
      toast.success("Product restored");
      await fetchProducts();
    } catch (error) {
      console.error("Error unarchiving product:", error);
      toast.error("Failed to restore product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesType = selectedType === "all" || product.type === selectedType;

    const matchesArchived = showArchived || product.status !== "archived";

    return matchesSearch && matchesType && matchesArchived;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
            Active
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
            Archived
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "subscription":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
            Subscription
          </Badge>
        );
      case "usage_based":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
            Usage-based
          </Badge>
        );
      case "one_time":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
            One-time
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        );
    }
  };

  // Format price from cents to display
  const formatPrice = (priceInCents: number, currency: string = "USD") => {
    const amount = priceInCents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // Calculate revenue stats
  const activeProducts = products.filter((p) => p.status === "active");
  const subscriptionProducts = products.filter(
    (p) => p.type === "subscription",
  );
  const oneTimeProducts = products.filter((p) => p.type === "one_time");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Products
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Manage your subscription plans and credit packs
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Sync
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 min-h-[44px]">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create New Product
                </DialogTitle>
                <DialogDescription>
                  Add a new product to DodoPayments
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="9.99"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Product Type</Label>
                    <Select
                      value={newProduct.type}
                      onValueChange={(value: ProductType) =>
                        setNewProduct({ ...newProduct, type: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="one_time">One-time</SelectItem>
                        <SelectItem value="subscription">
                          Subscription
                        </SelectItem>
                        <SelectItem value="usage_based">Usage-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={isCreating || !newProduct.name || !newProduct.price}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm mb-4 lg:mb-6">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[44px]"
            />
            <div className="flex flex-wrap gap-2">
              {["all", "subscription", "usage_based", "one_time"].map(
                (type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className={`min-h-[40px] px-4 ${
                      selectedType === type
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "border-slate-700 text-slate-300 hover:bg-slate-800 active:bg-slate-700"
                    }`}
                  >
                    {type === "all"
                      ? "All"
                      : type === "subscription"
                        ? "Subscriptions"
                        : type === "one_time"
                          ? "One-time"
                          : "Usage-based"}
                  </Button>
                ),
              )}
            </div>
            {/* Show Archived Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="show-archived"
                checked={showArchived}
                onCheckedChange={(checked) => setShowArchived(checked === true)}
                className="border-slate-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <label
                htmlFor="show-archived"
                className="text-sm text-slate-400 cursor-pointer select-none"
              >
                Show archived products
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : products.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="py-20 text-center">
            <p className="text-slate-400 mb-4">No products found</p>
            <Button
              onClick={handleSync}
              variant="outline"
              className="border-slate-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync from DodoPayments
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group ${
                  product.status === "archived" ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-white group-hover:text-purple-400 transition-colors text-base sm:text-lg truncate">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm line-clamp-2">
                        {product.description || "No description"}
                      </CardDescription>
                    </div>
                    {getStatusBadge(product.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.type === "subscription" && (
                        <span className="text-slate-400 text-sm">
                          /{product.paymentFrequencyInterval || "month"}
                        </span>
                      )}
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2">
                      {getTypeBadge(product.type)}
                      {product.licenseKeyEnabled && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                          License Key
                        </Badge>
                      )}
                    </div>

                    {/* Dodo Product ID */}
                    <div className="pt-3 sm:pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Dodo ID</span>
                        <span className="text-white font-mono text-xs truncate max-w-[150px]">
                          {product.dodoProductId}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 active:bg-slate-700 min-h-[40px]"
                      >
                        Edit
                      </Button>
                      {product.status === "archived" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnarchive(product.id)}
                          className="border-slate-700 text-emerald-400 hover:bg-emerald-500/20 min-h-[40px]"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchive(product.id)}
                          className="border-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400 min-h-[40px]"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Summary */}
          <Card className="mt-4 lg:mt-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-white text-lg sm:text-xl">
                Product Overview
              </CardTitle>
              <CardDescription className="text-sm">
                Summary of your product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="text-center p-3 sm:p-4 rounded-xl bg-slate-800/50">
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {products.length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Total Products
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-slate-800/50">
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {activeProducts.length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Active
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-slate-800/50">
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {subscriptionProducts.length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Subscriptions
                  </p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-slate-800/50">
                  <p className="text-lg sm:text-2xl font-bold text-white">
                    {oneTimeProducts.length}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    One-time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
