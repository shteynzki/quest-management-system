Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'

  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post 'login', to: 'sessions#create'
    delete 'logout', to: 'sessions#destroy'
    get 'me', to: 'users#me'
    post 'users', to: 'users#create'
    
    get 'dashboard_data', to: 'dashboards#show'
    get 'schedule', to: 'schedules#index'

    resources :quests, only: [:index, :show] do
      member do
        get 'timetable'
        post 'order'
      end
    end

    resources :games, only: [:show, :destroy] do
      resource :report, only: [:create, :show] do
        post 'analyze_photo', on: :collection
      end
      resources :reviews, only: [:create]
    end

    resources :actor_transactions, only: [:index, :create]
    
    resources :staff, only: [:index] do
      collection do
        post 'update_schedule'
        get 'monthly_report'
      end
    end
  end
end