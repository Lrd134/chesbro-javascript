class UsersController < ApplicationController

  def index
    options = {};
    user = User.all
    options[:is_collection] = true;
    render json: serialize_user(user, options)
  end
  def show
    user = User.find_by(name: params[:name])
    render json: serialize_user(user)
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: serialize_user(user)
    else
      render json: {message: "error" }.to_json
    end
    
  end

  def update
    user = User.find_by(name: params[:name])
    if user.update(name: params[:user][:newName], highscore: params[:user][:highscore])
      render json: serialize_user(user)
    else
      render json: {message: "error" }.to_json
    end
  end

  def destroy
    user = User.find_by(name: params[:name])
    user.destroy
    
    if user.destroyed?
      render json: {
        message: "Destroyed successfully."
    }.to_json
    else
      render json: {message: "error" }.to_json
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :highscore, :id)
  end

  def serialize_user(user, options = nil)
    if options
      UserSerializer.new(user, options).serialized_json
    else
      UserSerializer.new(user).serialized_json
    end
  end

end