class UsersController < ApplicationController

  def show
    users = User.find_by(name: params[:name])
    render json: UserSerializer.new(user).serialized_json
  end

  def new

  end

  def create

  end

  def edit

  end

  def update
    
  end

  def destroy

  end

end
