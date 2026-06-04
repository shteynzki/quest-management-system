class AddDetailsToReports < ActiveRecord::Migration[8.1]
  def change
    add_column :reports, :source_type, :string
    add_column :reports, :source_name, :string
    add_column :reports, :actual_actor_id, :bigint
    add_column :reports, :payment_method, :string
    add_column :reports, :players_count, :integer
    add_column :reports, :discount_type, :string
    add_column :reports, :discount_custom, :string
    add_column :reports, :photo_sold, :boolean, default: false
    add_column :reports, :photo_payment, :string
    add_column :reports, :extra_expenses, :integer, default: 0
    add_column :reports, :comment, :text
    add_column :reports, :calculated_amount, :integer
    add_column :reports, :actual_amount, :integer
    add_column :reports, :amount_mismatch_reason, :text

    add_foreign_key :reports, :users, column: :actual_actor_id
  end
end