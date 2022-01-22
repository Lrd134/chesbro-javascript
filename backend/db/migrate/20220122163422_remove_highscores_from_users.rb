class RemoveHighscoresFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :highscore
  end
end
