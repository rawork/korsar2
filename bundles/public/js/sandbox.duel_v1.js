(function($){
    (function(init){
        init();
    }(function(){

        /*
         ----------------------------------------
         PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S)
         ----------------------------------------
         */

        var pluginNS="duelGame",
            pluginPfx="duelGame",
            defaultSelector=".game-duel",
            duelStorage = null,
            answerInterval = null,



            currentTime;

        /*
         ----------------------------------------
         DEFAULT OPTIONS
         ----------------------------------------
         */

            defaults={

                userInfoUrl: '/ajax/sandbox/duel/data',
                questionUrl: '/ajax/sandbox/duel/question',
                moneyUpdateUrl: '/ajax/sandbox/duel/data',

                messageInit: '<h2 class="init-message">Игра загружается, подождите...</h2>',
                messageBefore: '<h2 class="before-message">Время начала игры<br>#time#</h2><br><button class="btn" id="btn-reload">Обновить страницу</button>',
                messageAfter: '<h2 class="end-message">Игра завершена</h2>'
            },

        /*
         ----------------------------------------
         VARS, CONSTANTS
         ----------------------------------------
         */

            totalInstances=0, /* plugin instances amount */
        /* general plugin classes */


        /*
         ----------------------------------------
         METHODS
         ----------------------------------------
         */

            methods={

                /*
                 plugin initialization method
                 creates the scrollbar(s), plugin data object and options
                 ----------------------------------------
                 */

                init:function(options){
                    var that = this;

                    var options=$.extend(true,{},defaults,options),
                        selector=_selector.call(this); /* validate selector */

                    /* plugin constructor */
                    return $(selector).each(function(){

                        var that = this;
                        var $this=$(this);

                        if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */

                            /* store options and create objects in jquery data */
                            $this.data(pluginPfx,{
                                idx:++totalInstances, /* instance index */
                                opt:options, /* options */
                                /*
                                 object to check how scrolling events where last triggered
                                 "internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method)
                                 usage: object.data("mCS").trigger
                                 */
                                trigger:null
                            });

                            var d=$this.data(pluginPfx),o=d.opt;

                            ns=$.initNamespaceStorage(pluginNS);
                            duelStorage = ns.localStorage // Namespace in localStorage

                            _initMessage.call(this);
                            _setEvents.call(this);

                            if(duelStorage.isEmpty('questions')) {
                                $.get(o.userInfoUrl, {},
                                    function(data){

                                        console.log(data);

                                        if (data.error) {
                                            $this.html('<h2 class="init-message">'+data.error+'</h2>');
                                            return;
                                        }

                                        duelStorage.set('questions', data.questions);
                                        duelStorage.set('active', false);
                                        duelStorage.set('qnum', 0);
                                        duelStorage.set('answers', 0);

                                    }, "json");
                            }

                            methods.start.call(that);

                        }
                    });
                },
                /* ---------------------------------------- */

                start: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    _pluginMarkup.call(that);

                },
                /* ---------------------------------------- */

                stop: function() {
                    var that = this;
                    var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                    _afterMessage.call(that);
                }
                /* ---------------------------------------- */

            },


        /*
         ----------------------------------------
         FUNCTIONS
         ----------------------------------------
         */

        /* validates selector (if selector is invalid or undefined uses the default one) */
            _selector=function(){
                return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
            };
        /* -------------------- */

        /* init message */
            _initMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html(o.messageInit);
            };
        /* -------------------- */

        /* before message */
            _beforeMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
                var dt = new Date(marketStorage.get('start')*1000);
                var msg = o.messageBefore;
                msg = msg.replace('#time#', dt.getFullYear() + '.' + (dt.getMonth()<10?'0':'') + dt.getMonth() + '.' + (dt.getDate()<10?'0':'') + dt.getDate() + ' ' + (dt.getHours()<10?'0':'') + dt.getHours() + ':' + (dt.getMinutes()<10?'0':'') + dt.getMinutes());
                $this.html(msg);
            };
        /* -------------------- */

        /* after message */
            _afterMessage=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html(o.messageAfter);
            };
        /* -------------------- */

        /* generates plugin markup */
            _pluginMarkup=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $this.html('<div class="relative"><div class="question"><div id="timer" class="timer"></div><div class="title"><strong>Вопрос <span id="qnum"></span> из 25</strong></div> <div class="text" id="question"></div><ul class="answers" id="answers"><li><input type="radio" id="answer_1" name="answer" value="1" /><label for="answer_1"></label></li><li><input type="radio" id="answer_2" name="answer" value="2" /><label for="answer_2"></label> </li><li><input type="radio" id="answer_3" name="answer" value="3" /><label for="answer_3"></label></li> </ul></div></div><div class="gamer gamer1" id="gamer1"><img src=""> <div class="name"></div> <div class="ship"></div> <div class="action"><button class="btn btn-duel-answer">Ответить</button></div></div><div class="gamer gamer2" id="gamer2"><img src=""> <div class="name"></div><div class="ship"></div><div class="action"><div class="message">Соперник отвечает</div></div></div>');

            };
        /* -------------------- */

        /* set events for buttons */
            _setEvents=function(){
                var that = this;
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;

                $(document).on('click', '#btn-reload', function(){
                    window.location.reload();
                });

                $(document).on('click', '#market-chests li:not(.skull,.money)', function(e){
                    e.preventDefault();
                    currentChest = $(this).attr('id');
                    var questions = marketStorage.get('questions');
                    var question = questions[currentChest]['question'];
                    $.post(o.questionUrl, {question: question, table: marketStorage.get('table')},
                        function(data){
                            marketStorage.set('started', 25);
                            answerNum = data.question.answer;
                            $('#myModal .close').hide();
                            $('#modal-content').html('<div id="answer-timer"></div><div class="question">'+data.question.question +'</div>')
                                .append('<div class="answers"><input name="question" value="1" type="hidden"><input type="radio" id="answer_1" name="answer" value="1" /><label for="answer_1">'+ data.question.answer1 + '</label><br><br><input type="radio" id="answer_2" name="answer" value="2" /><label for="answer_2">'+ data.question.answer2 +'</label><br><br><input type="radio" id="answer_3" name="answer" value="3" /><label for="answer_3">' + data.question.answer3 +'</label></div><button id="market-btn-answer" class="btn">Ответить</button><div class="answer-time"></div>');
                            $('#answer-timer').html(marketStorage.get('started'));
                            answerInterval = setInterval(function(){
                                var realTimer = marketStorage.get('started');
                                $('#answer-timer').html(--realTimer);
                                marketStorage.set('started', realTimer);
                                if (realTimer <= 0) {
                                clearInterval(answerInterval);
                                $('#market-btn-answer').trigger('click');
                                }
                            }, 1000);
                            $('#myModal').show();

                        }, 'json');

                });


                $(document).on('click', '#dice', function(){
                    var dice = $(this);
                    $(".wrap").append("<div id='dice_mask'></div>");//add mask
                    dice.attr("class","dice");//After clearing the last points animation
                    dice.css('cursor','default');
                    var num = Math.floor(Math.random()*6+1);//random num 1-6
                    dice.animate({left: '+2px'}, 100,function(){
                        dice.addClass("dice_t");
                    }).delay(200).animate({top:'-2px'},100,function(){
                        dice.removeClass("dice_t").addClass("dice_s");
                    }).delay(200).animate({opacity: 'show'},600,function(){
                        dice.removeClass("dice_s").addClass("dice_e");
                    }).delay(100).animate({left:'-2px',top:'2px'},100,function(){
                        dice.removeClass("dice_e").addClass("dice_"+num);
                        $("#result").html("Your throwing points are<span>"+num+"</span>");
                        dice.css('cursor','pointer');
                        $("#dice_mask").remove();//remove mask
                    });
                });

                $(document).on('click', '.btn-duel-answer', function(e) {
                    e.preventDefault();
                    clearTimeout(answerInterval);
                    var userAnswer = $('.answers input:checked').val();
                    var questions =
                        marketStorage.get('questions');
                    if (answerNum == userAnswer) {
                        questions[currentChest]['class'] = 'money';
                        $('#'+currentChest).removeClass('chest money skull').addClass('money');

                    } else {
                        questions[currentChest]['class'] = 'skull';
                        $('#'+currentChest).removeClass('chest money skull').addClass('skull');
                    }
                    marketStorage.set('questions', questions);
                    currentChest = null;
                    $('#myModal .close').show();
                    $('#myModal').hide();
                    answerNum = 999;
                });

                $(document).on('click', '.market-time', function(){
                    methods.stop.call(that);
                });

            };
        /* -------------------- */

        /* integer division */
            _integerDivision=function (x, y){
                return (x-x%y)/y;
            };
        /* -------------------- */

        /*
         ----------------------------------------
         PLUGIN SETUP
         ----------------------------------------
         */

        /* plugin constructor functions */
        $.fn[pluginNS]=function(method){ /* usage: $(selector).diceGame(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };
        $[pluginNS]=function(method){ /* usage: $.diceGame(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };

        /*
         allow setting plugin default options.
         usage: $.mCustomScrollbar.defaults.scrollInertia=500;
         to apply any changed default options on default selectors (below), use inside document ready fn
         e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
         */
        $[pluginNS].defaults=defaults;

        /*
         add window object (window.mCustomScrollbar)
         usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
         */
        window[pluginNS]=true;

        $(window).load(function(){

            $(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */

        });

    }))})(jQuery);

