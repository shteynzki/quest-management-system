class CreateReports < ActiveRecord::Migration[8.1]
  def change
    create_table :reports do |t|
      t.string :info
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end
  end
end
