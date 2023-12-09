package appdomain

import (
	citydomain "define/city_domain"
	playerdomain "define/player_domain"
)

type AppDomain struct {
	playerdomain.PlayerDomain
	citydomain.CityDomain
}
