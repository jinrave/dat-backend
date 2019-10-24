<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $view;
    
    /**
     * Create a new controller instance.
     *
     * @return void
     * 
     * @author 
     * @since @version 0.1
     */
    public function __construct()
    {
    	$this->view = __v();
    }
}
