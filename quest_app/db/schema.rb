# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_31_173356) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.bigint "record_id", null: false
    t.string "record_type", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.string "content_type"
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.string "key", null: false
    t.text "metadata"
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "actor_schedules", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "day_of_week"
    t.integer "quest_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_actor_schedules_on_user_id"
  end

  create_table "actor_transactions", force: :cascade do |t|
    t.float "amount"
    t.string "category"
    t.text "comment"
    t.datetime "created_at", null: false
    t.bigint "game_id"
    t.string "transaction_type"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["game_id"], name: "index_actor_transactions_on_game_id"
    t.index ["user_id"], name: "index_actor_transactions_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "info"
    t.bigint "quest_id", null: false
    t.datetime "time"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["quest_id"], name: "index_games_on_quest_id"
    t.index ["user_id"], name: "index_games_on_user_id"
  end

  create_table "quest_tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "quest_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "updated_at", null: false
    t.index ["quest_id", "tag_id"], name: "index_quest_tags_on_quest_id_and_tag_id", unique: true
    t.index ["quest_id"], name: "index_quest_tags_on_quest_id"
    t.index ["tag_id"], name: "index_quest_tags_on_tag_id"
  end

  create_table "quest_views", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "quest_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["quest_id"], name: "index_quest_views_on_quest_id"
    t.index ["user_id"], name: "index_quest_views_on_user_id"
  end

  create_table "quests", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "info"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "reports", force: :cascade do |t|
    t.bigint "actual_actor_id"
    t.integer "actual_amount"
    t.text "amount_mismatch_reason"
    t.integer "calculated_amount"
    t.text "comment"
    t.datetime "created_at", null: false
    t.integer "discount_custom"
    t.string "discount_type"
    t.integer "extra_expenses", default: 0
    t.bigint "game_id", null: false
    t.string "payment_method"
    t.string "photo_payment"
    t.boolean "photo_sold", default: false
    t.integer "players_count"
    t.string "source_name"
    t.string "source_type"
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_reports_on_game_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "quest_id", null: false
    t.integer "score", default: 5, null: false
    t.text "text"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["quest_id"], name: "index_reviews_on_quest_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "last_name"
    t.string "name"
    t.string "password_digest"
    t.integer "role", default: 0
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "actor_schedules", "quests"
  add_foreign_key "actor_schedules", "users"
  add_foreign_key "actor_transactions", "games"
  add_foreign_key "actor_transactions", "users"
  add_foreign_key "games", "quests"
  add_foreign_key "games", "users"
  add_foreign_key "quest_tags", "quests"
  add_foreign_key "quest_tags", "tags"
  add_foreign_key "quest_views", "quests"
  add_foreign_key "quest_views", "users"
  add_foreign_key "reports", "games"
  add_foreign_key "reports", "users", column: "actual_actor_id"
  add_foreign_key "reviews", "quests"
  add_foreign_key "reviews", "users"
end
