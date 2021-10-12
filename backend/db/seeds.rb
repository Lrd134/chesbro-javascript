# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
larry = User.create!(name: "Larry")
pablo = User.create!(name: "Pablo")
ezekiel = User.create!(name: "Ezekiel")
potter = User.create!(name: "Potter")
albus = User.create!(name: "Albus")
nora = User.create!(name: "Nora")
Score.create!(score: 3, user: nora)
Score.create!(score: 1, user: potter)
Score.create!(score: 2, user: ezekiel)
Score.create!(score: 1, user: albus)
Score.create!(score: 2, user: pablo)