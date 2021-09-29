Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, except: %i[show update]
  scope '/users' do 
    get '/:name', to: 'users#show'
    post '/:name', to: 'users#update'
  end
end
