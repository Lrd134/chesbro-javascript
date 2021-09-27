class AddHighscoreToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :highscore, :integer
  end
end
