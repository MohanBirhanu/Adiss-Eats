import React, { useEffect, useState, useMemo } from "react";
import { Dish, Category } from "@/src/types/dish";
import { getDishes, createDish, updateDish, deleteDish } from "@/src/lib/api";
import { formatCurrency } from "@/src/lib/formatCurrency";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Modal } from "@/src/components/ui/Modal";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Check,
  X,
  AlertTriangle,
  Flame,
} from "lucide-react";

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // Form field states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Ethiopian" | "Pizza" | "Burgers" | "Drinks"
  >("Ethiopian");
  const [price, setPrice] = useState<number>(450);
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [available, setAvailable] = useState(true);
  const [spicy, setSpicy] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirmation modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDishes = async () => {
    setIsLoading(true);
    const data = await getDishes();
    setDishes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDishes();
  }, []);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return dishes;
    return dishes.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [dishes, searchQuery]);

  const openAddModal = () => {
    setEditingDish(null);
    setName("");
    setDescription("");
    setCategory("Ethiopian");
    setPrice(350);
    setImageUrl(
      "https://i.pinimg.com/1200x/46/cc/48/46cc48f9f2466294e7babf0e8c3fc745.jpg"
    );
    setIngredientsText("Beef, Berbere, Garlic, Onions, Spiced Butter");
    setAvailable(true);
    setSpicy(false);
    setFormError("");
    setFormModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setDescription(dish.description);
    setCategory(dish.category);
    setPrice(dish.price);
    setImageUrl(dish.image);
    setIngredientsText(dish.ingredients ? dish.ingredients.join(", ") : "");
    setAvailable(dish.available);
    setSpicy(!!dish.spicy);
    setFormError("");
    setFormModalOpen(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Dish name is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (!price || price <= 0) {
      setFormError("Price must be greater than 0.");
      return;
    }
    if (!imageUrl.trim()) {
      setFormError("Image URL is required.");
      return;
    }

    const ingredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      if (editingDish) {
        // Update
        const updated: Dish = {
          ...editingDish,
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          image: imageUrl.trim(),
          ingredients,
          available,
          spicy,
        };
        await updateDish(updated);
      } else {
        // Create
        await createDish({
          name: name.trim(),
          description: description.trim(),
          category,
          price: Number(price),
          image: imageUrl.trim(),
          ingredients,
          available,
          spicy,
          featured: false,
          prepTime: "20-30 min",
          rating: 4.8,
        });
      }

      setFormModalOpen(false);
      await loadDishes();
    } catch (err) {
      console.error(err);
      setFormError("Failed to save dish. Please try again.");
    }
  };

  const openDeleteModal = (dish: Dish) => {
    setDishToDelete(dish);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!dishToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDish(dishToDelete.id);
      setDeleteModalOpen(false);
      setDishToDelete(null);
      await loadDishes();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Menu Management (CRUD)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Create, update, and manage food dishes, pricing in ETB, and
            availability.
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Dish
        </Button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter dishes by name or category..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      </div>

      {/* Dishes Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
              <tr>
                <th className="py-3 px-4">Dish</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredDishes.map((dish) => (
                <tr
                  key={dish.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                      />
                      <div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          {dish.name}
                          {dish.spicy && (
                            <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">
                          {dish.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {dish.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(dish.price)}
                  </td>
                  <td className="py-3 px-4">
                    {dish.available ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-md">
                        <X className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(dish)}
                        className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                        title="Edit Dish"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(dish)}
                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingDish ? `Edit ${editingDish.name}` : "Add New Menu Dish"}
        description="Fill out the dish details below. Changes persist across the application."
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDish} className="space-y-4">
          <Input
            label="Dish Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Special Derek Tibs"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dish-category-select"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5"
              >
                Category
              </label>
              <select
                id="dish-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="Ethiopian">Ethiopian</option>
                <option value="Pizza">Pizza</option>
                <option value="Burgers">Burgers</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>

            <Input
              label="Price (ETB)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="450"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="dish-description-textarea"
              className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              Description
            </label>
            <textarea
              id="dish-description-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of taste, ingredients, and traditional serving."
              className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />
          </div>

          <Input
            label="Ingredients (comma separated)"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="Chicken, Berbere, Egg, Spiced Clarified Butter"
          />

          <Input
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Available for Order</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={spicy}
                onChange={(e) => setSpicy(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <span>Spicy / Berbere Blend</span>
            </label>
          </div>

          {formError && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200">
              {formError}
            </p>
          )}

          <div className="pt-4 flex justify-end gap-2 border-t border-stone-100 dark:border-stone-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingDish ? "Save Changes" : "Create Dish"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Menu Dish"
        description="Are you sure you want to permanently delete this dish? This will remove it from customer menus."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
            <span>
              Dish: <strong>{dishToDelete?.name}</strong> (ETB{" "}
              {dishToDelete?.price})
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isDeleting}
            >
              Delete Dish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
