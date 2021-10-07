class ApplicationController < ActionController::API


  private
    def shouldFail?
      t = Time.now
      t.min % 5 === 0 || t.sec % 3 === 0 ? true : false
    end
end
