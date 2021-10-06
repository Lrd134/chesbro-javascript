Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, except: %i[edit] do 
    resources :scores, only: %i[create index]
  end
end
