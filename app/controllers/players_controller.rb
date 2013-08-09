class PlayersController < ApplicationController
	respond_to :html, :json
	def index
		respond_with Player.all
	end
	def show
		respond_with Player.find(params[:id])
	end
end
