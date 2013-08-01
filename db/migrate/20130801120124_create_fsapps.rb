class CreateFsapps < ActiveRecord::Migration
  def change
    create_table :fsapps do |t|
      t.string :name
      t.string :text
      t.string :birthplace
      t.integer :age
      t.string :position
      t.string :image

      t.timestamps
    end
  end
end
