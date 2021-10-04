Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users, except: %i[show update destroy edit]
  scope '/users' do 
    get '/:name', to: 'users#show'
    post '/:name', to: 'users#update'
    delete '/:name', to: 'users#destroy'
    post '/:name/scores', to: 'scores#create'
  end
  
end
