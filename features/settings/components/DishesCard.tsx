"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Dish } from "@/features/requests";
import { cn } from "@/shared/lib/cn";
import { Button, Field, FIELD_CONTROL } from "@/shared/ui";

import { ICON_BUTTON, MONEY, PANEL_CARD, toGel, toTetri } from "./menu-fields";

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

interface DishesCardProps {
  dishes: Dish[];
  onChange: (dishes: Dish[]) => void;
}

export function DishesCard({ dishes, onChange }: DishesCardProps) {
  const [draft, setDraft] = useState({ name: "", note: "", price: "" });

  const addDish = () => {
    const name = draft.name.trim();
    if (!name) return;
    const base = slug(name) || "dish";
    const taken = new Set(dishes.map((dish) => dish.key));
    let key = base;
    for (let n = 2; taken.has(key); n += 1) key = `${base}-${n}`;
    onChange([
      ...dishes,
      {
        key,
        name,
        note: draft.note.trim(),
        priceTetri: toTetri(draft.price),
        available: true,
        translations: {},
      },
    ]);
    setDraft({ name: "", note: "", price: "" });
  };

  const updateDish = (key: string, patch: Partial<Dish>) =>
    onChange(
      dishes.map((dish) =>
        dish.key === key
          ? {
              ...dish,
              ...patch,
              translations: patch.name ? {} : dish.translations,
            }
          : dish,
      ),
    );

  return (
    <div className={cn(PANEL_CARD, "mt-3.5 overflow-hidden")}>
      <div className="flex flex-wrap items-end gap-2.5 border-b border-line-soft px-5 py-4 sm:px-6">
        <Field label="Dish" className="min-w-40 flex-1">
          <input
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") addDish();
            }}
            placeholder="Adjarian khachapuri"
            className={FIELD_CONTROL}
          />
        </Field>
        <Field label="Note (optional)" className="min-w-40 flex-1">
          <input
            value={draft.note}
            onChange={(event) =>
              setDraft({ ...draft, note: event.target.value })
            }
            placeholder="Cheese, butter, egg"
            className={FIELD_CONTROL}
          />
        </Field>
        <Field label="Price, ₾" className="w-28">
          <input
            inputMode="decimal"
            value={draft.price}
            onChange={(event) =>
              setDraft({ ...draft, price: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") addDish();
            }}
            className={cn(FIELD_CONTROL, "font-mono")}
          />
        </Field>
        <Button
          variant="dark"
          disabled={draft.name.trim().length === 0}
          onClick={addDish}
          className="min-h-11"
        >
          <Plus strokeWidth={1.8} className="size-3.5" />
          Add dish
        </Button>
      </div>

      {dishes.length === 0 ? (
        <p className="px-5 py-8 text-center text-[13px] text-faint sm:px-6">
          No dishes yet. Until you add one, the “Room service” card is hidden
          from guests.
        </p>
      ) : null}

      {dishes.map((dish) => (
        <div
          key={dish.key}
          className={cn(
            "flex flex-wrap items-center gap-2.5 border-b border-line-soft px-5 py-3 last:border-b-0 sm:px-6",
            dish.available ? "opacity-100" : "opacity-55",
          )}
        >
          <input
            aria-label="Dish name"
            value={dish.name}
            onChange={(event) =>
              updateDish(dish.key, { name: event.target.value })
            }
            className="min-h-9.5 min-w-40 flex-1 rounded-[10px] border border-transparent bg-transparent px-2 text-sm font-medium outline-none hover:border-line focus:border-line-strong"
          />
          <input
            aria-label="Dish note"
            value={dish.note}
            placeholder="Note"
            onChange={(event) =>
              updateDish(dish.key, { note: event.target.value })
            }
            className="min-h-9.5 min-w-40 flex-1 rounded-[10px] border border-transparent bg-transparent px-2 text-[13px] text-muted outline-none hover:border-line focus:border-line-strong"
          />
          <label className="flex items-center gap-1.5 text-[13px] text-muted">
            <input
              key={dish.priceTetri}
              aria-label="Price in lari"
              inputMode="decimal"
              defaultValue={toGel(dish.priceTetri)}
              onBlur={(event) =>
                updateDish(dish.key, {
                  priceTetri: toTetri(event.target.value),
                })
              }
              className={MONEY}
            />
            ₾
          </label>
          <button
            type="button"
            onClick={() => updateDish(dish.key, { available: !dish.available })}
            className={cn(
              "min-h-7.5 cursor-pointer rounded-full px-2.5 text-[11.5px] font-medium",
              dish.available
                ? "bg-sage/10 text-sage-deep"
                : "bg-ink/5 text-faint",
            )}
          >
            {dish.available ? "Available" : "Off the menu"}
          </button>
          <button
            type="button"
            aria-label={`Delete ${dish.name}`}
            onClick={() =>
              onChange(dishes.filter((entry) => entry.key !== dish.key))
            }
            className={ICON_BUTTON}
          >
            <Trash2 strokeWidth={1.6} className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
