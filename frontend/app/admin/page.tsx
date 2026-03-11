"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth, authErrorMessage } from "@/components/providers/AuthProvider";
import { apiFetchJson, ApiError } from "@/lib/api";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type AdminStats = { users: number; products: number; orders: number };
type Banner = { _id: string; imageUrl: string; title: string; isActive: boolean; order: number };
type CategoryItem = { _id: string; name: string; slug: string };
type ProductItem = { _id: string; name: string; slug: string; price: number; stock: number; images: string[]; isFeatured?: boolean; weight?: number; weightUnit?: string };

function formatCount(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-100 ${className}`} />;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="overflow-hidden">
      <CardBody>
        <div className="text-xs font-medium text-zinc-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{formatCount(value)}</div>
      </CardBody>
    </Card>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, accessToken, ready, logout } = useAuth();

  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadUrl, setUploadUrl] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [bannerLoading, setBannerLoading] = React.useState(false);
  const [bannerTitle, setBannerTitle] = React.useState("");
  const [addingBanner, setAddingBanner] = React.useState(false);

  // Product form state
  const [productName, setProductName] = React.useState("");
  const [productPrice, setProductPrice] = React.useState("");
  const [productStock, setProductStock] = React.useState("0");
  const [productWeight, setProductWeight] = React.useState("");
  const [productCategory, setProductCategory] = React.useState("");
  const [productDescription, setProductDescription] = React.useState("");
  const [productFeatured, setProductFeatured] = React.useState(true);
  const [creatingProduct, setCreatingProduct] = React.useState(false);
  const [productError, setProductError] = React.useState<string | null>(null);
  const [productSuccess, setProductSuccess] = React.useState<string | null>(null);

  // Categories & products list
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(false);

  // Edit product state
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [editProductName, setEditProductName] = React.useState("");
  const [editProductPrice, setEditProductPrice] = React.useState("");
  const [editProductStock, setEditProductStock] = React.useState("");
  const [editProductWeight, setEditProductWeight] = React.useState("");
  const [editProductCategory, setEditProductCategory] = React.useState("");
  const [editProductDescription, setEditProductDescription] = React.useState("");
  const [editProductFeatured, setEditProductFeatured] = React.useState(false);
  const [editProductImage, setEditProductImage] = React.useState("");
  const [updatingProduct, setUpdatingProduct] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent("/admin")}`);
      return;
    }

    if (user.role !== "admin") {
      setLoading(false);
      setError("Admin access required");
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!accessToken) throw new Error("Not authenticated");
        const res = await apiFetchJson<AdminStats>("/api/admin/stats", { token: accessToken, cache: "no-store" });
        setStats(res);
      } catch (err) {
        setError(authErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [ready, user, accessToken, router]);

  const onUpload = async () => {
    setUploadError(null);
    setUploadUrl(null);

    try {
      if (!accessToken) throw new Error("Not authenticated");
      if (!file) throw new Error("Please choose a file");

      setUploading(true);
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      const contentType = res.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const body = isJson ? ((await res.json()) as unknown) : await res.text();

      if (!res.ok) {
        const payload = (typeof body === "object" && body != null ? (body as { message?: string }) : undefined) ?? undefined;
        throw new ApiError(payload?.message || `Upload failed (${res.status})`, res.status);
      }

      const data = body as { url: string };
      setUploadUrl(data.url);
    } catch (err) {
      setUploadError(authErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const fetchBanners = React.useCallback(async () => {
    setBannerLoading(true);
    try {
      const res = await apiFetchJson<{ items: Banner[] }>("/api/banners", { cache: "no-store" });
      setBanners(res.items);
    } catch {
      /* ignore */
    } finally {
      setBannerLoading(false);
    }
  }, []);

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await apiFetchJson<{ items: CategoryItem[] }>("/api/categories", { cache: "no-store" });
      setCategories(res.items);
      if (res.items.length > 0 && !productCategory) setProductCategory(res.items[0].slug);
    } catch {
      /* ignore */
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = React.useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await apiFetchJson<{ items: ProductItem[] }>("/api/products?limit=48", { cache: "no-store" });
      setProducts(res.items);
    } catch {
      /* ignore */
    } finally {
      setProductsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (ready && user?.role === "admin") {
      void fetchBanners();
      void fetchCategories();
      void fetchProducts();
    }
  }, [ready, user, fetchBanners, fetchCategories, fetchProducts]);

  const addBanner = async () => {
    if (!uploadUrl || !accessToken) return;
    setAddingBanner(true);
    try {
      await apiFetchJson("/api/banners", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({ imageUrl: uploadUrl, title: bannerTitle }),
      });
      setBannerTitle("");
      setUploadUrl(null);
      setFile(null);
      void fetchBanners();
    } catch (err) {
      setUploadError(authErrorMessage(err));
    } finally {
      setAddingBanner(false);
    }
  };

  const removeBanner = async (id: string) => {
    if (!accessToken) return;
    try {
      await apiFetchJson(`/api/banners/${id}`, { method: "DELETE", token: accessToken });
      void fetchBanners();
    } catch {
      /* ignore */
    }
  };

  const onCreateProduct = async () => {
    setProductError(null);
    setProductSuccess(null);

    if (!accessToken) { setProductError("Not authenticated"); return; }
    if (!uploadUrl) { setProductError("Pehle image upload karein"); return; }
    if (!productName.trim()) { setProductError("Product name required hai"); return; }
    if (!productPrice || Number(productPrice) <= 0) { setProductError("Valid price daalein"); return; }
    if (!productCategory) { setProductError("Category select karein"); return; }

    setCreatingProduct(true);
    try {
      const productData: any = {
        name: productName.trim(),
        categorySlug: productCategory,
        price: Number(productPrice),
        images: [uploadUrl],
        description: productDescription,
        stock: Number(productStock) || 0,
        isFeatured: productFeatured,
      };

      if (productWeight) {
        productData.weight = Number(productWeight);
        productData.weightUnit = "g";
      }

      await apiFetchJson("/api/products", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify(productData),
      });
      setProductSuccess(`"${productName}" added successfully!`);
      setProductName("");
      setProductPrice("");
      setProductStock("0");
      setProductWeight("");
      setProductDescription("");
      setProductFeatured(true);
      setUploadUrl(null);
      setFile(null);
      void fetchProducts();
    } catch (err) {
      setProductError(authErrorMessage(err));
    } finally {
      setCreatingProduct(false);
    }
  };

  const onDeleteProduct = async (id: string) => {
    if (!accessToken) return;
    try {
      await apiFetchJson(`/api/products/${id}`, { method: "DELETE", token: accessToken });
      void fetchProducts();
    } catch {
      /* ignore */
    }
  };

  const startEditProduct = (product: ProductItem) => {
    setEditingProductId(product._id);
    setEditProductName(product.name);
    setEditProductPrice(String(product.price));
    setEditProductStock(String(product.stock));
    setEditProductWeight(product.weight ? String(product.weight) : "");
    setEditProductCategory("");
    setEditProductDescription("");
    setEditProductFeatured(product.isFeatured ?? false);
    setEditProductImage(product.images?.[0] ?? "");
    setUpdateError(null);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditProductName("");
    setEditProductPrice("");
    setEditProductStock("");
    setEditProductWeight("");
    setEditProductCategory("");
    setEditProductDescription("");
    setEditProductFeatured(false);
    setEditProductImage("");
    setUpdateError(null);
  };

  const onUpdateProduct = async () => {
    setUpdateError(null);

    if (!accessToken) { setUpdateError("Not authenticated"); return; }
    if (!editingProductId) return;
    if (!editProductName.trim()) { setUpdateError("Product name required hai"); return; }
    if (!editProductPrice || Number(editProductPrice) <= 0) { setUpdateError("Valid price daalein"); return; }

    setUpdatingProduct(true);
    try {
      const updateData: any = {
        name: editProductName.trim(),
        price: Number(editProductPrice),
        stock: Number(editProductStock) || 0,
        isFeatured: editProductFeatured,
      };

      if (editProductWeight) {
        updateData.weight = Number(editProductWeight);
        updateData.weightUnit = "g";
      }
      if (editProductCategory) {
        updateData.categorySlug = editProductCategory;
      }
      if (editProductDescription) {
        updateData.description = editProductDescription;
      }
      if (editProductImage) {
        updateData.images = [editProductImage];
      }

      await apiFetchJson(`/api/products/${editingProductId}`, {
        method: "PUT",
        token: accessToken,
        body: JSON.stringify(updateData),
      });

      cancelEdit();
      void fetchProducts();
    } catch (err) {
      setUpdateError(authErrorMessage(err));
    } finally {
      setUpdatingProduct(false);
    }
  };

  return (
    <div className="bg-zinc-50">
      <div className="container-x py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium text-zinc-500">Dashboard</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">Admin</h1>
            <div className="mt-1 text-sm text-zinc-600">
              {user ? (
                <span>
                  Signed in as <span className="font-medium text-zinc-900">{user.email}</span>
                </span>
              ) : (
                <span>Manage store data and uploads</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-10 w-28" />
                  </CardBody>
                </Card>
              </div>
            </div>

            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="text-sm font-semibold text-zinc-900">Upload image</div>
                <div className="mt-1 text-xs text-zinc-500">Upload a product or marketing image</div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </CardBody>
            </Card>
          </div>
        ) : null}

        {!loading && !error ? (
          <>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div>
                <div className="text-sm font-semibold text-zinc-900">Overview</div>
                <div className="mt-1 text-xs text-zinc-500">High-level store metrics</div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <StatCard label="Users" value={stats?.users ?? 0} />
                <StatCard label="Products" value={stats?.products ?? 0} />
                <StatCard label="Orders" value={stats?.orders ?? 0} />
              </div>
            </div>

            {/* Add Product Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="text-sm font-semibold text-zinc-900">Add New Product</div>
                <div className="mt-1 text-xs text-zinc-500">Upload image &amp; fill product details</div>
              </CardHeader>
              <CardBody>
                <div className="grid gap-3">
                  {/* Image upload */}
                  <div className="grid gap-1">
                    <label htmlFor="admin-upload" className="text-sm font-medium text-zinc-900">
                      Product Image
                    </label>
                    <Input
                      id="admin-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="text-xs text-zinc-500">
                      {file ? (
                        <span>Selected: <span className="font-medium text-zinc-900">{file.name}</span></span>
                      ) : (
                        <span>No file selected</span>
                      )}
                    </div>
                  </div>

                  {!uploadUrl ? (
                    <div className="flex items-center gap-2">
                      <Button onClick={onUpload} disabled={!file || uploading}>
                        {uploading ? "Uploading…" : "Upload Image"}
                      </Button>
                      {uploading ? <div className="text-xs text-zinc-500">Please wait…</div> : null}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                      <img
                        src={uploadUrl}
                        alt="Uploaded"
                        className="w-full rounded-lg border border-zinc-200 aspect-[4/3] object-cover"
                      />
                    </div>
                  )}

                  {uploadError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                      {uploadError}
                    </div>
                  ) : null}

                  {/* Product details — shown after image uploaded */}
                  {uploadUrl ? (
                    <>
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Product Name *</label>
                        <Input
                          placeholder="e.g. Oyster Mushroom 200g"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <label className="text-sm font-medium text-zinc-900">Price (₹) *</label>
                          <Input
                            type="number"
                            placeholder="299"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-1">
                          <label className="text-sm font-medium text-zinc-900">Weight (g)</label>
                          <Input
                            type="number"
                            placeholder="200"
                            value={productWeight}
                            onChange={(e) => setProductWeight(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Stock</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Category *</label>
                        <select
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                        >
                          <option value="">-- Select Category --</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Description</label>
                        <textarea
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                          rows={3}
                          placeholder="Product description..."
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value)}
                        />
                      </div>

                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productFeatured}
                          onChange={(e) => setProductFeatured(e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-300"
                        />
                        Featured (Home page pe dikhega)
                      </label>

                      {productError ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{productError}</div>
                      ) : null}

                      {productSuccess ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{productSuccess}</div>
                      ) : null}

                      <Button onClick={onCreateProduct} disabled={creatingProduct}>
                        {creatingProduct ? "Adding Product…" : "Add Product"}
                      </Button>
                    </>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Products list */}
          <div className="mt-8">
            <div className="text-sm font-semibold text-zinc-900">All Products</div>
            <div className="mt-1 text-xs text-zinc-500">Products jo home page aur shop pe dikhte hain</div>

            {productsLoading ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
                No products yet. Upload an image above to add your first product.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((p) => (
                  <Card key={p._id} className="overflow-hidden">
                    <div className="aspect-[4/3] w-full bg-zinc-50">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-sm text-zinc-400">No image</div>
                      )}
                    </div>
                    <CardBody>
                      <div className="text-xs font-semibold text-zinc-900 line-clamp-1">{p.name}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="text-xs text-zinc-600">₹{p.price} · Stock: {p.stock}</div>
                        {p.isFeatured && <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button variant="secondary" className="flex-1 text-xs" onClick={() => startEditProduct(p)}>
                          Edit
                        </Button>
                        <Button variant="secondary" className="flex-1 text-xs" onClick={() => onDeleteProduct(p._id)}>
                          Delete
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Edit Product Modal */}
          {editingProductId ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <div className="text-sm font-semibold text-zinc-900">Edit Product</div>
                  <div className="mt-1 text-xs text-zinc-500">Update product details</div>
                </CardHeader>
                <CardBody>
                  <div className="grid gap-3">
                    {/* Current image preview */}
                    {editProductImage ? (
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                        <img
                          src={editProductImage}
                          alt="Product"
                          className="w-full rounded-lg border border-zinc-200 aspect-[4/3] object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-zinc-900">Product Name *</label>
                      <Input
                        placeholder="e.g. Oyster Mushroom 200g"
                        value={editProductName}
                        onChange={(e) => setEditProductName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Price (₹) *</label>
                        <Input
                          type="number"
                          placeholder="299"
                          value={editProductPrice}
                          onChange={(e) => setEditProductPrice(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Weight (g)</label>
                        <Input
                          type="number"
                          placeholder="200"
                          value={editProductWeight}
                          onChange={(e) => setEditProductWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-zinc-900">Stock</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={editProductStock}
                        onChange={(e) => setEditProductStock(e.target.value)}
                      />
                    </div>

                    {categories.length > 0 && (
                      <div className="grid gap-1">
                        <label className="text-sm font-medium text-zinc-900">Category (optional)</label>
                        <select
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                          value={editProductCategory}
                          onChange={(e) => setEditProductCategory(e.target.value)}
                        >
                          <option value="">Keep current category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid gap-1">
                      <label className="text-sm font-medium text-zinc-900">Description (optional)</label>
                      <textarea
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                        rows={3}
                        placeholder="Product description..."
                        value={editProductDescription}
                        onChange={(e) => setEditProductDescription(e.target.value)}
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editProductFeatured}
                        onChange={(e) => setEditProductFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                      Featured (Home page pe dikhega)
                    </label>

                    {updateError ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{updateError}</div>
                    ) : null}

                    <div className="flex gap-2">
                      <Button onClick={onUpdateProduct} disabled={updatingProduct} className="flex-1">
                        {updatingProduct ? "Updating…" : "Update Product"}
                      </Button>
                      <Button variant="secondary" onClick={cancelEdit} disabled={updatingProduct}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : null}

          {/* Banner management */}
          <div className="mt-8">
            <div className="text-sm font-semibold text-zinc-900">Home Page Banners</div>
            <div className="mt-1 text-xs text-zinc-500">Banners for the homepage hero carousel.</div>

            {bannerLoading ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : banners.length === 0 ? (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-500">
                No banners yet.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {banners.map((b) => (
                  <Card key={b._id} className="overflow-hidden">
                    <img src={b.imageUrl} alt={b.title || "Banner"} className="aspect-[16/9] w-full object-cover" />
                    <CardBody>
                      <div className="text-xs font-medium text-zinc-900">{b.title || "(No title)"}</div>
                      <Button variant="secondary" className="mt-2" onClick={() => removeBanner(b._id)}>
                        Delete
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
