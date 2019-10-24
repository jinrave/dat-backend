@extends(__v() . '.layouts.app')

@section('content')
<style>
    /* Header */
.login-box {
	position: absolute;
	margin: 0;
	padding: 0;
	color: #f9f1e9;
	text-align: center;
	top: 50%;
	left: 50%;
	-webkit-transform: translate3d(-50%,-50%,0);
	transform: translate3d(-50%,-50%,0);
}
</style>
<div id="large-header" class="large-header">
    <canvas id="demo-canvas"></canvas>
    <div id="app" class="login-box">
        <div class="login-logo">
            <a href="/" class="typed">&nbsp;</a>
        </div>
        <div class="login-box-body">
            <form id="login" action="{{ route('login') }}" method="post">
                @csrf
                <div class="form-group has-feedback{{ $errors->has('email') ? ' has-error' : '' }}">
                    <span class="fa fa-envelope form-control-feedback"></span>
                    <input id="email" type="email" class="form-control" name="email" autofocus="true" autocomplete="off" value="{{ app()->environment('staging') ? 'demo@laravelpos.com' : '' }}{{ app()->environment('local') ? '' : '' }}">
                    @if ($errors->has('email'))
                        <span class="help-block" role="alert">
                            <strong>{{ $errors->first('email') }}</strong>
                        </span>
                    @endif
                </div>
                <div class="form-group has-feedback{{ $errors->has('password') ? ' has-error' : '' }}">
                    <span class="fa fa-key form-control-feedback"></span>
                    <input id="password" type="password" class="form-control" name="password" value="{{ app()->environment('staging') ? 'password' : '' }}{{ app()->environment('local') ? '' : '' }}">
                    @if ($errors->has('password'))
                        <span class="help-block" role="alert">
                            <strong>{{ $errors->first('password') }}</strong>
                        </span>
                    @endif
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="checkbox icheck">
                            <label>
                                <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn btn-primary btn-block btn-flat primary-btn">Sign In</button>
                    </div>
                </div>
            </form>
            {{-- <div class="social-auth-links text-center">
                <p>- OR -</p>
                <a href="{{ action('Api\oAuthController@redirectToProvider', ['provider' => 'facebook']) }}" class="btn btn-block btn-social btn-facebook btn-flat"><i class="fa fa-facebook"></i> Sign in using
                Facebook</a>
                <a href="{{ action('Api\oAuthController@redirectToProvider', ['provider' => 'google']) }}" class="btn btn-block btn-social btn-google btn-flat"><i class="fa fa-google-plus"></i> Sign in using
                Google+</a>
            </div> --}}
            <a href="{{ route('password.request') }}" class="text-center is-block mt-15">I forgot my password</a><br>
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="text-center">Register a new membership</a>
            @endif
        </div>
    </div>
</div>
@endsection

@section('js')
<script src="https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/EasePack.min.js"></script>
<script src="https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/rAF.js"></script>
<script src="https://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/js/TweenLite.min.js"></script>
<script>
(function() {

var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

// Main
initHeader();
initAnimation();
addListeners();

function initHeader() {
    width = window.innerWidth;
    height = window.innerHeight;
    target = {x: width/2, y: height/2};

    largeHeader = document.getElementById('large-header');
    largeHeader.style.height = height+'px';

    canvas = document.getElementById('demo-canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');

    // create points
    points = [];
    for(var x = 0; x < width; x = x + width/20) {
        for(var y = 0; y < height; y = y + height/20) {
            var px = x + Math.random()*width/20;
            var py = y + Math.random()*height/20;
            var p = {x: px, originX: px, y: py, originY: py };
            points.push(p);
        }
    }

    // for each point find the 5 closest points
    for(var i = 0; i < points.length; i++) {
        var closest = [];
        var p1 = points[i];
        for(var j = 0; j < points.length; j++) {
            var p2 = points[j]
            if(!(p1 == p2)) {
                var placed = false;
                for(var k = 0; k < 5; k++) {
                    if(!placed) {
                        if(closest[k] == undefined) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }

                for(var k = 0; k < 5; k++) {
                    if(!placed) {
                        if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                            closest[k] = p2;
                            placed = true;
                        }
                    }
                }
            }
        }
        p1.closest = closest;
    }

    // assign a circle to each point
    for(var i in points) {
        var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
        points[i].circle = c;
    }
}

// Event handling
function addListeners() {
    if(!('ontouchstart' in window)) {
        window.addEventListener('mousemove', mouseMove);
    }
    window.addEventListener('scroll', scrollCheck);
    window.addEventListener('resize', resize);
}

function mouseMove(e) {
    var posx = posy = 0;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    target.x = posx;
    target.y = posy;
}

function scrollCheck() {
    if(document.body.scrollTop > height) animateHeader = false;
    else animateHeader = true;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    largeHeader.style.height = height+'px';
    canvas.width = width;
    canvas.height = height;
}

// animation
function initAnimation() {
    animate();
    for(var i in points) {
        shiftPoint(points[i]);
    }
}

function animate() {
    if(animateHeader) {
        ctx.clearRect(0,0,width,height);
        for(var i in points) {
            // detect points in range
            if(Math.abs(getDistance(target, points[i])) < 4000) {
                points[i].active = 0.3;
                points[i].circle.active = 0.6;
            } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                points[i].active = 0.1;
                points[i].circle.active = 0.3;
            } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                points[i].active = 0.02;
                points[i].circle.active = 0.1;
            } else {
                points[i].active = 0;
                points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
        }
    }
    requestAnimationFrame(animate);
}

function shiftPoint(p) {
    TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
        y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
        onComplete: function() {
            shiftPoint(p);
        }});
}

// Canvas manipulation
function drawLines(p) {
    if(!p.active) return;
    for(var i in p.closest) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.closest[i].x, p.closest[i].y);
        ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
        ctx.stroke();
    }
}

function Circle(pos,rad,color) {
    var _this = this;

    // constructor
    (function() {
        _this.pos = pos || null;
        _this.radius = rad || null;
        _this.color = color || null;
    })();

    this.draw = function() {
        if(!_this.active) return;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
        ctx.fill();
    };
}

// Util
function getDistance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

})();
</script>
<script>
$(function () {
    let Login = $('form');
        Login.find('#email').focus();
        Login.find('input[type="checkbox"]').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        }).on('ifChanged', function(e){
            const field = $(this).attr('name');
            Login.formValidation('revalidateField', field);
        });
    let validators = {
        email: {
            validators: {
                notEmpty: {},
                regexp:{
                    regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                }
            }
        },
        password: {
            validators: {
                notEmpty: {}
            }
        },
        remember: {
            validators: {}
        }
    };
    Login.callFormValidation(validators)
    .on('success.form.fv', function(e) {
        e.preventDefault();
        Login.parents('#app').waitMeShow();
        let $form = $(e.target),
            fv    = $form.data('formValidation');
        axios.post(
            $form.attr('action'), $form.serialize()+'&agree='+$('#agree').is(':checked')
        ).then((r) => {
            @if (app()->environment(['local', 'production']))
                location.reload();
            @elseif(app()->environment('staging'))
                window.location.href = 'https://demo.laravel-pos.com';
            @endif
        }).catch((e) => {
            Login.parents('#app').waitMeHide();
            fv.resetForm(true);
            if(e.response.status === 422){
                if(typeof e.response.data.errors.email !== 'undefined'){
                    danger(e.response.data.errors.email[0]);
                }
            }
        });
    });
    const typed = new Typed('.typed', {
        strings: ['', 'Welcome to', window.App.APP_NAME],
        typeSpeed: 100,
        backSpeed: 30,
        backDelay: 30,
        startDelay: 0,
        loop: false,
    });
    const email = new Typed('#email', {
        strings: ['yourmail@'+window.App.APP_NAME.replace(/\s/g, '').toLowerCase()+'.com', ''],
        typeSpeed: 100,
        backSpeed: 30,
        backDelay: 30,
        startDelay: 0,
        attr: 'placeholder',
        bindInputFocusEvents: true,
        loop: true
      });
    const password = new Typed('#password', {
        strings: ['********', ''],
        typeSpeed: 100,
        backSpeed: 30,
        backDelay: 30,
        startDelay: 0,
        attr: 'placeholder',
        bindInputFocusEvents: true,
        loop: true
      });
    store.clearAll();
});
</script>
@endsection